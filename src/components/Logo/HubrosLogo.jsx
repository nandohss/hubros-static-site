// Logo SVG do HuBros — baseado no ícone do app
// Dois arcos laterais (lados externos arredondados, internos retos) + círculo torso + círculo cabeça
export default function HubrosLogo({ size = 32, className = '' }) {
    // ViewBox fixo 100x100, escalável via width/height
    // Proporções:
    // - Pilares com lado externo totalmente arredondado (raio acompanha a largura) e interno reto.
    // - Círculo do torso e cabeça do mesmo tamanho, isolados no canal central sem tocar nos pilares.
    
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="Hubros logo"
        >
            {/*
              Pilar ESQUERDO: 
              - Lado interno reto em x=35. 
              - Curva externa com raio de 13.
            */}
            <path
                d="M 35,36 L 35,86 A 13,13 0 0,1 22,73 L 22,49 A 13,13 0 0,1 35,36 Z"
                fill="white"
            />

            {/*
              Pilar DIREITO: 
              - Lado interno reto em x=65.
              - Curva externa com raio de 13.
            */}
            <path
                d="M 65,36 L 65,86 A 13,13 0 0,0 78,73 L 78,49 A 13,13 0 0,0 65,36 Z"
                fill="white"
            />

            {/* Torso — perfeitamente centralizado no espaço vazio entre os pilares */}
            <circle cx="50" cy="66" r="13" fill="white" />

            {/* Cabeça — círculo do mesmo tamanho, com distanciamento alinhado ao topo dos pilares */}
            <circle cx="50" cy="28" r="13" fill="white" />
        </svg>
    )
}