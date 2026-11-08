function decodeBase64(value: string) {
  try {
    return atob(value);
  } catch {
    return "";
  }
}

export function isAdminAuthorized(authHeader: string | null) {
  const expectedUser = process.env.ADMIN_BASIC_USER;
  const expectedPass = process.env.ADMIN_BASIC_PASS;

  if (!expectedUser || !expectedPass) {
    return false;
  }

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return false;
  }

  const base64 = authHeader.split(" ")[1] || "";
  const decoded = decodeBase64(base64);

  if (!decoded.includes(":")) {
    return false;
  }

  const separatorIndex = decoded.indexOf(":");
  const user = decoded.slice(0, separatorIndex);
  const pass = decoded.slice(separatorIndex + 1);

  return user === expectedUser && pass === expectedPass;
}
