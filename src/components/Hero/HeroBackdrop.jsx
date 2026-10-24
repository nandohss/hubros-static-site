const PHOTOS = [
    '/blog/clinic_room.jpg',
    '/blog/host_room.jpg',
    '/blog/productivity_desk.jpg',
    '/blog/coworking_backstage.jpg',
    '/blog/hybrid_work.jpg',
]

const ROWS = [
    [0, 1, 2, 3, 4],
    [3, 0, 4, 1, 2],
    [2, 4, 1, 0, 3],
    [4, 2, 3, 1, 0],
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
