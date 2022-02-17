type BoardSize = "small" | "medium" | "large" | "extraLarge";

interface Config {
    css: string,
    size: number
}

export const gameboardConfig: Record<BoardSize, Config> = {
    small: {
        css: "gameboard-sm",
        size: 7
    },
    medium: {
        css: "gameboard-md",
        size: 15,
    },
    large: {
        css: "gameboard-lg",
        size: 21 
    },
    extraLarge: {
        css: "gameboard-xl",
        size: 27
    }
};