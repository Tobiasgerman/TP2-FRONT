import { createClient } from '@supabase/supabase-js';

const STORAGE_KEYS = {
  user: "e2e:user",
  foods: "e2e:foods",
};

function readJson(key, fallback) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

class MockTableQuery {
  constructor(tableName, operation = "select", payload = null) {
    this.tableName = tableName;
    this.operation = operation;
    this.payload = payload;
    this.filters = [];
  }

  select() {
    this.operation = "select";
    return this;
  }

  update(payload) {
    this.operation = "update";
    this.payload = payload;
    return this;
  }

  eq(field, value) {
    this.filters.push({ field, value });
    return this;
  }

  async insert(payload) {
    const foods = readJson(STORAGE_KEYS.foods, []);
    const item = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...payload,
    };

    writeJson(STORAGE_KEYS.foods, [item, ...foods]);
    return { data: item, error: null };
  }

  async order(field, { ascending } = { ascending: true }) {
    const result = await this.execute();

    result.data = [...result.data].sort((left, right) => {
      const leftValue = left[field] || "";
      const rightValue = right[field] || "";
      return ascending
        ? leftValue.localeCompare(rightValue)
        : rightValue.localeCompare(leftValue);
    });

    return result;
  }

  async single() {
    const result = await this.execute();
    return {
      data: result.data[0] || null,
      error: result.data[0] ? null : { message: "Registro no encontrado" },
    };
  }

  then(resolve, reject) {
    return this.execute().then(resolve, reject);
  }

  async execute() {
    if (this.tableName !== "Comidas") {
      return { data: null, error: { message: "Tabla no soportada en E2E" } };
    }

    const foods = readJson(STORAGE_KEYS.foods, []);
    const matchesFilters = (food) =>
      this.filters.every(({ field, value }) => food[field] === value);

    if (this.operation === "update") {
      const updatedFoods = foods.map((food) =>
        matchesFilters(food) ? { ...food, ...this.payload } : food
      );

      writeJson(STORAGE_KEYS.foods, updatedFoods);
      return { data: updatedFoods.filter(matchesFilters), error: null };
    }

    return { data: foods.filter(matchesFilters), error: null };
  }
}

function createMockSupabase() {
  return {
    auth: {
      async getUser() {
        return { data: { user: readJson(STORAGE_KEYS.user, null) }, error: null };
      },
      async signInWithPassword({ email }) {
        const user = { id: "e2e-user", email };
        writeJson(STORAGE_KEYS.user, user);
        return { data: { user }, error: null };
      },
      async signUp({ email }) {
        const user = { id: "e2e-user", email };
        writeJson(STORAGE_KEYS.user, user);
        return { data: { user }, error: null };
      },
      async signOut() {
        window.localStorage.removeItem(STORAGE_KEYS.user);
        return { error: null };
      },
    },
    from(tableName) {
      return new MockTableQuery(tableName);
    },
  };
}

export const supabase =
  import.meta.env.PUBLIC_E2E_MODE === "true"
    ? createMockSupabase()
    : createClient(
        import.meta.env.PUBLIC_SUPABASE_URL,
        import.meta.env.PUBLIC_SUPABASE_ANON_KEY
      );
