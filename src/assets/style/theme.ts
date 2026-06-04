const theme = {
  size: {
    xxl: {
      value: 3.375,
      get px() {
        return `${this.value * 16}px`;
      },
    },
    xl: {
      value: 2.25,
      get px() {
        return `${this.value * 16}px`;
      },
    },
    l: {
      value: 1.5,
      get px() {
        return `${this.value * 16}px`;
      },
    },
    m: {
      value: 1.125,
      get px() {
        return `${this.value * 16}px`;
      },
    },
    s: {
      value: 0.75,
      get px() {
        return `${this.value * 16}px`;
      },
    },
    xs: {
      value: 0.5,
      get px() {
        return `${this.value * 16}px`;
      },
    },
    xxs: {
      value: 0.25,
      get px() {
        return `${this.value * 16}px`;
      },
    },
  },
};

const lightColors = {
  color: {
    background: "#e3eae8",
    surface: "#f8fffd",
    surfaceActive: "#eaf1ef",
    primary: "#10B981",
    primaryActive: "#0fad78",
    textPrimary: "#111827",
    textSecondary: "#6B7280",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#3B82F6",
    lightTransparency: "#00000019",
    shadow: "#6B7280",
  },
};
const darkColors: typeof lightColors = {
  color: {
    background: "#000000",
    surface: "#141c1d",
    surfaceActive: "#1c2626",
    primary: "#10B981",
    primaryActive: "#059669",
    textPrimary: "#F9FAFB",
    textSecondary: "#9CA3AF",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#3B82F6",
    lightTransparency: "#FFFFFF19",
    shadow: "#000000",
  },
};

export default { ...theme, ...lightColors };
export const darkTheme = { ...theme, ...darkColors };
