import type { VariantProps } from 'class-variance-authority';
import type {ComponentProps} from 'react';
import { iconStyles } from '@/components/icon/styles.ts';
import { type IconName } from '@/types/icon';
import {cn} from "@/utils/formatUtil.ts";

export type IconProps = VariantProps<typeof iconStyles> &
  ComponentProps<'svg'> & {
  name: IconName;
};

export default function Icon({ name, color, size, ...rest }: IconProps) {
  const { className, ...attributes } = rest;

  return (
    <svg
      className={cn(iconStyles({ size, color }), className)}
      {...attributes}
    >
      <use href={`sprite.svg#${name}`} />
    </svg>
  );
}
