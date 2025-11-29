declare module 'react-pageflip' {
  import { Component, RefObject } from 'react';

  export interface HTMLFlipBookProps {
    width?: number;
    height?: number;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    onFlip?: (e: { data: number }) => void;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  export default class HTMLFlipBook extends Component<HTMLFlipBookProps> {
    flipNext(): void;
    flipPrev(): void;
    flip(pageNum: number): void;
    getPageNum(): number;
  }
}

