export enum FitType {
  cover = 'cover',
  contain = 'contain',
  fill = 'fill',
  inside = 'inside',
  outside = 'outside',
}

export enum Positions {
  top = 'top',
  rightTop = 'right top',
  right = 'right',
  rightBottom = 'right bottom',
  bottom = 'bottom',
  leftBottom = 'left bottom',
  left = 'left',
  leftTop = 'left top',
  centre = 'centre',
}

export interface ResizeParams {
  input: string;
  output: string;
  fit: FitType;
  position: Positions;
  width: number;
  height: number;
}

export interface ImageInfoResult {
  orientation?: number;
  size?: number;
  width?: number;
  height?: number;
}
