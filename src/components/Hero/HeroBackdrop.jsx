// Capas de espaços do ambiente de dev (Clinical Plus, Mind Spaces, Heability, Smilling
// Clinicals, Office44, WeWorq), recortadas em 16:7 sem a marca d'água do Gemini.
const PHOTOS = [
    '/hero/clinical-plus.jpg',
    '/hero/mind-spaces.jpg',
    '/hero/heability.jpg',
    '/hero/smilling-clinicals.jpg',
    '/hero/office44.jpg',
    '/hero/weworq.jpg',
]

const ROWS = [
    [0, 1, 2, 3, 4, 5],
    [4, 5, 0, 3, 1, 2],
    [3, 2, 5, 1, 0, 4],
    [5, 3, 1, 4, 2, 0],
]

export default function HeroBackdrop() {
    return (
        <div className="hero__backdrop" aria-hidden="true">
            <div className="hero__rows">
                {ROWS.map((order, r) => {
                    const tiles = [...order, ...order]
                    return (
                        <div key={r} className={`hero__row ${r % 2 ? 'hero__row--rev' : ''}`} style={{ '--row-dur': `${70 + r * 8}s` }}>
                            {tiles.map((p, k) => (
                                <img key={k} src={PHOTOS[p]} alt="" loading={r < 2 ? 'eager' : 'lazy'} decoding="async" />
                            ))}
                        </div>
                    )
                })}
            </div>
            <div className="hero__scrim" />
        </div>
    )
}
