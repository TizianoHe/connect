/**
 * The one horizontal frame every public page sits in.
 *
 * Before this existed, each page picked its own container: the header was
 * max-w-6xl, the reading column max-w-2xl and centred, the footer max-w-6xl
 * again, and /browse used max-w-7xl for two of the three. The result was a
 * wordmark that never lined up with the text underneath it, and a footer that
 * started 64px further in than the page above it.
 *
 * These two constants live in their own module so header, footer and shell can
 * all import them without importing one another.
 */

/** Default frame. /browse overrides it because the card grid needs the room. */
export const SHELL_WIDTH = "max-w-6xl";

/**
 * Padding must match in all three slots or the alignment breaks on phones,
 * where px-4 and px-6 differ by 8px.
 */
export const SHELL_PADDING = "px-4 sm:px-6";
