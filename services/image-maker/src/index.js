export function generatePlaceholders(count = 6) {
    const imgs = [];
    for (let i = 0; i < count; i++) {
        const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%' height='100%' fill='hsl(${(i * 40) % 360} 60% 70%)'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='36' fill='#111'>Placeholder ${i + 1}</text></svg>`;
        imgs.push('data:image/svg+xml;utf8,' + encodeURIComponent(svg));
    }
    return { images: imgs, palette: ['#0ea5a4', '#06b6d4', '#f97316', '#ef4444', '#facc15'] };
}
