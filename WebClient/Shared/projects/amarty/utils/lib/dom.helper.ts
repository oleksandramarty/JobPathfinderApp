export function extractClassName(iconString: string): string {
    const match = iconString.match(/class="([^"]*)"/);
    return match ? match[1] : '';
}
