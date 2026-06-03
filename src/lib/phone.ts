export const normalizePhoneInternational = (value?: string | null): string => {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) {
    return "";
  }

  let normalized = digits;
  if (normalized.startsWith("0")) {
    normalized = normalized.slice(1);
  }
  if (!normalized.startsWith("61")) {
    normalized = `61${normalized}`;
  }

  return normalized;
};

export const normalizePhoneLocal = (value?: string | null): string => {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) {
    return "";
  }

  let normalized = digits;
  if (normalized.startsWith("61")) {
    normalized = normalized.slice(2);
  }
  if (!normalized.startsWith("0")) {
    normalized = `0${normalized}`;
  }

  return normalized;
};

export const phonesMatch = (
  left?: string | null,
  right?: string | null,
): boolean => {
  const leftIntl = normalizePhoneInternational(left);
  const rightIntl = normalizePhoneInternational(right);

  if (!leftIntl || !rightIntl) {
    return false;
  }

  if (leftIntl === rightIntl) {
    return true;
  }

  return normalizePhoneLocal(left) === normalizePhoneLocal(right);
};
