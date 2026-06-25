import Image, { type ImageProps } from "next/image";

type AppImageProps = ImageProps & {
  readonly src: string;
};

export const AppImage = ({ src, alt = "", className, style, ...props }: AppImageProps) => {
  if (src.endsWith(".svg")) {
    if ("fill" in props && props.fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={className}
          style={{ ...style, width: "100%", height: "100%", objectFit: "contain" }}
        />
      );
    }

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={className}
        style={style}
        width={"width" in props ? props.width : undefined}
        height={"height" in props ? props.height : undefined}
      />
    );
  }

  return (
    <Image src={src} alt={alt} className={className} style={style} {...props} />
  );
};
