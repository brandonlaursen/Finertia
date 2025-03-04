import "./Skeleton.css";

function Skeleton({ width, height, borderRadius = "4px" }) {
  return (
    <div
      className="Skeleton"
      style={{
        width: width || "100%",
        height: height || "20px",
        borderRadius: borderRadius,
      }}
    />
  );
}

export default Skeleton;
