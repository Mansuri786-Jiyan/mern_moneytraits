/**
 * Mask an email address for privacy (e.g., "johndoe@example.com" -> "j***e@example.com")
 */
export const maskEmail = (email) => {
    if (!email) return "";
    const [local, domain] = email.split("@");
    if (local.length <= 2) return `${local[0]}*@${domain}`;
    return `${local[0]}***${local[local.length - 1]}@${domain}`;
};

/**
 * Mask a name for privacy (e.g., "John Doe" -> "J***e")
 */
export const maskName = (name) => {
    if (!name) return "";
    const parts = name.split(" ");
    if (parts.length === 1) {
        const n = parts[0];
        return n.length <= 2 ? n : `${n[0]}***${n[n.length - 1]}`;
    }
    return parts.map(p => p.length <= 2 ? p : `${p[0]}***${p[p.length - 1]}`).join(" ");
};
