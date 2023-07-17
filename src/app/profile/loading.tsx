import LoadingAnimation from "@/components/Loading";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex items-center justify-center w-full h-96">
      <LoadingAnimation />
    </div>
  );
}
