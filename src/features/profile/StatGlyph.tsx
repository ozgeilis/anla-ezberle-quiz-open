import React from "react";
import Svg, { Circle, Path } from "react-native-svg";
import { Icon, type IconName } from "../../components/ui";
export type StatIcon = IconName | "gamepad" | "flame";
export function StatGlyph({ name, color }: { name: StatIcon; color: string }) {
  if (name === "gamepad")
    return (
      <Svg
        width={22}
        height={22}
        viewBox="0 0 24 24"
        accessible={false}
        aria-hidden
      >
        <Path
          d="M7 6h10c3 0 5 8 4 11-.5 2-3 2-5-1H8c-2 3-4.5 3-5 1C2 14 4 6 7 6Z"
          fill={color}
        />
        <Path
          d="M8 9v5m-2.5-2.5h5"
          stroke="#077B69"
          strokeWidth={1.6}
          strokeLinecap="round"
        />
        <Circle cx={16} cy={10} r={1.1} fill="#077B69" />
        <Circle cx={18} cy={13} r={1.1} fill="#077B69" />
      </Svg>
    );
  if (name === "flame")
    return (
      <Svg
        width={22}
        height={22}
        viewBox="0 0 24 24"
        accessible={false}
        aria-hidden
      >
        <Path
          d="M13 2c2 5 0 7 2 8 1-1 2-2 2-4 5 5 6 11 2 14-4 4-13 3-15-3-2-5 2-8 5-11-1 4 0 5 1 5 3-2 3-5 3-9Z"
          fill={color}
        />
        <Path
          d="M12 13c0 3-3 3-2 6 1 2 5 2 6-1 .5-2-2-3-2-5-1 2-2 3-2 0Z"
          fill="#F49B54"
        />
      </Svg>
    );
  return <Icon name={name} size={20} color={color} />;
}
