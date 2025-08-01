// @ts-expect-error This is how it is
import feather from "feather-icons";

export default function FeatherIcon({ iconName }: { iconName: string }) {
  return (
    <i
      dangerouslySetInnerHTML={{ __html: feather.icons[iconName]?.toSvg() }}
    ></i>
  );
}
