import React from 'react';
import Svg, { Circle, Line, Path, Polygon, Polyline, Rect } from 'react-native-svg';

export default function Icon({ name, size = 18, color = 'currentColor', filled = false, style }) {
  const strokeColor = color === 'currentColor' ? '#172554' : color;
  const fillColor = filled ? strokeColor : 'none';

  const renderContent = () => {
    switch (name) {
      case 'star':
        return (
          <Polygon
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            fill={filled ? strokeColor : 'none'}
            stroke={strokeColor}
            strokeWidth="2"
          />
        );
      case 'play':
        return (
          <Polygon
            points="5 3 19 12 5 21 5 3"
            fill={filled ? strokeColor : 'none'}
            stroke={strokeColor}
            strokeWidth="2"
          />
        );
      case 'mail':
        return (
          <>
            <Rect x="4" y="4" width="16" height="16" rx="2" stroke={strokeColor} strokeWidth="2" fill="none" />
            <Polyline points="22,6 12,13 2,6" stroke={strokeColor} strokeWidth="2" fill="none" />
          </>
        );
      case 'lock':
        return (
          <>
            <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke={strokeColor} strokeWidth="2" fill="none" />
            <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={strokeColor} strokeWidth="2" fill="none" />
          </>
        );
      case 'user':
        return (
          <>
            <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={strokeColor} strokeWidth="2" fill="none" />
            <Circle cx="12" cy="7" r="4" stroke={strokeColor} strokeWidth="2" fill="none" />
          </>
        );
      case 'eye':
        return (
          <>
            <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={strokeColor} strokeWidth="2" fill="none" />
            <Circle cx="12" cy="12" r="3" stroke={strokeColor} strokeWidth="2" fill="none" />
          </>
        );
      case 'eye-off':
        return (
          <>
            <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke={strokeColor} strokeWidth="2" fill="none" />
            <Line x1="1" y1="1" x2="23" y2="23" stroke={strokeColor} strokeWidth="2" />
          </>
        );
      case 'clock':
        return (
          <>
            <Circle cx="12" cy="12" r="10" stroke={strokeColor} strokeWidth="2" fill="none" />
            <Path d="M12 8v4l3 3" stroke={strokeColor} strokeWidth="2" fill="none" />
          </>
        );
      case 'volume':
        return (
          <>
            <Polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke={strokeColor} strokeWidth="2" fill="none" />
            <Path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" stroke={strokeColor} strokeWidth="2" fill="none" />
          </>
        );
      case 'search':
        return (
          <>
            <Circle cx="11" cy="11" r="8" stroke={strokeColor} strokeWidth="2" fill="none" />
            <Line x1="21" y1="21" x2="16.65" y2="16.65" stroke={strokeColor} strokeWidth="2" />
          </>
        );
      case 'menu':
        return <Path d="M3 12h18M3 6h18M3 18h18" stroke={strokeColor} strokeWidth="2" fill="none" />;
      case 'close':
        return <Path d="M18 6L6 18M6 6l12 12" stroke={strokeColor} strokeWidth="2" fill="none" />;
      case 'share':
        return (
          <>
            <Circle cx="18" cy="5" r="3" stroke={strokeColor} strokeWidth="2" fill="none" />
            <Circle cx="6" cy="12" r="3" stroke={strokeColor} strokeWidth="2" fill="none" />
            <Circle cx="18" cy="19" r="3" stroke={strokeColor} strokeWidth="2" fill="none" />
            <Line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke={strokeColor} strokeWidth="2" />
            <Line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke={strokeColor} strokeWidth="2" />
          </>
        );
      case 'arrow-right':
        return (
          <>
            <Line x1="5" y1="12" x2="19" y2="12" stroke={strokeColor} strokeWidth="2" />
            <Polyline points="12 5 19 12 12 19" stroke={strokeColor} strokeWidth="2" fill="none" />
          </>
        );
      case 'heart':
        return (
          <Path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            stroke={strokeColor}
            strokeWidth="2"
            fill={filled ? strokeColor : 'none'}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      {renderContent()}
    </Svg>
  );
}

