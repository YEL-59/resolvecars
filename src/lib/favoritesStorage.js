// Simple localStorage-backed store for saved vehicles (favorites)
const FAVORITES_KEY = "saved_vehicles";

function readRaw() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function writeRaw(list) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
  } catch (e) {
    // noop
  }
}

export const favoritesStorage = {
  key: FAVORITES_KEY,
  getAll() {
    return readRaw();
  },
  isSaved(id) {
    return readRaw().some((v) => String(v?.id) === String(id));
  },
  add(vehicle) {
    const list = readRaw();
    const id = vehicle?.id;
    if (id == null) return list;
    if (!list.some((v) => String(v?.id) === String(id))) {
      list.push(vehicle);
      writeRaw(list);
    }
    return list;
  },
  remove(id) {
    const list = readRaw().filter((v) => String(v?.id) !== String(id));
    writeRaw(list);
    return list;
  },
  toggle(vehicle) {
    const id = vehicle?.id;
    if (id == null) return readRaw();
    return this.isSaved(id) ? this.remove(id) : this.add(vehicle);
  },
  clear() {
    writeRaw([]);
    return [];
  },
};

export default favoritesStorage;