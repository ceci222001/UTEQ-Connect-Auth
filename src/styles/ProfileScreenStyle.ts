import { StyleSheet, Platform } from "react-native";

const HEADER_HEIGHT = Platform.OS === "ios" ? 130 : 110;
const AVATAR_SIZE = 96;
const AVATAR_OVERLAP = AVATAR_SIZE / 2; // cuánto sobresale del header

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F2F2",
    },

    // ── Header ──────────────────────────────────
    header: {
        height: 120,
        backgroundColor: "#1D356B",
        paddingHorizontal: 20,
        paddingTop: Platform.OS === "ios" ? 54 : 38,
        alignItems: "flex-end",
        justifyContent: "flex-start",
    },
    headerLogo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    headerLogoText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "700",
        letterSpacing: 0.4,
    },
    headerLogoSubText: {
        color: "#9CC3FF",
        fontSize: 12,
        fontWeight: "600",
    },

    // ── Avatar (fuera del scroll, flota sobre header y tarjeta) ──
    avatarContainer: {
        position: "absolute",
        top: HEADER_HEIGHT - AVATAR_OVERLAP,
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 20,
    },
    avatarWrapper: {
        position: "relative",
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
    },
    avatar: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        borderWidth: 4,
        borderColor: "#fff",
    },
    editAvatarButton: {
        position: "absolute",
        right: 0,
        bottom: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },

    // ── Scroll ──────────────────────────────────
    scrollView: {
        flex: 1,
        // sube el scroll para que la tarjeta quede bajo el avatar
        marginTop: -(AVATAR_OVERLAP),
    },
    scrollContent: {
        paddingTop: AVATAR_OVERLAP + 8,  // espacio = mitad del avatar + pequeño margen
        paddingBottom: 60,
    },

    // ── Tarjeta de perfil ────────────────────────
    content: {
        backgroundColor: "#fff",
        marginHorizontal: 16,
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 28,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.10,
        shadowRadius: 12,
        elevation: 5,
    },
    name: {
        marginTop: 4,
        fontSize: 20,
        fontWeight: "700",
        color: "#111",
    },
    badge: {
        marginTop: 8,
        borderWidth: 1,
        borderColor: "#333",
        paddingHorizontal: 14,
        paddingVertical: 4,
        borderRadius: 20,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#222",
    },
    email: {
        marginTop: 12,
        fontSize: 13,
        color: "#777",
    },
    logoutButton: {
        marginTop: 20,
        backgroundColor: "#8B0F1A",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        minWidth: 200,
        alignItems: "center",
    },
    logoutButtonText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
    },

    // ── Boletos ──────────────────────────────────
    ticketsSection: {
        marginTop: 24,
    },

    // ── legacy ───────────────────────────────────
    infoList: {
        marginTop: 24,
        width: "100%",
        gap: 10,
    },
    infoItem: {
        fontSize: 14,
        color: "#333",
    },
    bottomNav: {
        position: "absolute",
        left: 12,
        right: 12,
        bottom: 40,
        backgroundColor: "#fff",
        borderRadius: 999,
        paddingVertical: 10,
        paddingHorizontal: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
    navItem: {
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        minWidth: 64,
    },
    navLabel: {
        fontSize: 12,
        color: "#555",
        fontWeight: "600",
    },
});

export default styles;