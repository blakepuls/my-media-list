import React, { useRef } from "react";
import { useDrag, useDrop, DndProvider, DropTargetMonitor } from "react-dnd";
import { HTML5Backend, getEmptyImage } from "react-dnd-html5-backend";
import SeriesCard from "./SeriesCard";
import { Database } from "@/types/database.types";
import { useDragLayer } from "react-dnd";
import { useSpring, useTransition, animated } from "react-spring";
import FlipMove from "react-flip-move";

type Series = Database["public"]["Tables"]["series"]["Row"];

interface SeriesRowProps {
  series: Array<Series>;
  setSeries: (series: Array<Series>) => void;
}

interface DnDItemProps {
  id: string;
  item: Series;
  index: number;
  isDragging: boolean;
  setDragging: (isDragging: boolean) => void;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  id: string;
  type: string;
  index: number;
}

const DnDItem: React.FC<DnDItemProps> = ({
  id,
  item,
  index,
  moveItem,
  setDragging,
  isDragging,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const style = useSpring({
    transform: "translate(0,0)",
    from: { transform: "translate(0, 10px)" },
    config: { tension: 280 }, // Increase tension for faster animations
  });

  const [{ isDragging: isDraggingThisItem }, drag, preview] = useDrag({
    type: "ITEM",
    item: () => {
      setDragging(true);
      const rect = ref.current?.getBoundingClientRect();
      return {
        id,
        index,
        seriesItem: item,
        size: rect ? { width: rect.width, height: rect.height } : undefined,
      };
    },
    end: () => setDragging(false),
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  React.useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: false });
  }, [preview]);

  // React.useEffect(() => {
  //   setDragging(isDragging);
  // }, [isDragging]);

  const [, drop] = useDrop({
    accept: "ITEM",
    hover: (item: DragItem, monitor: DropTargetMonitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();

      if (clientOffset) {
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }

        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }

        moveItem(dragIndex, hoverIndex);
        item.index = hoverIndex;
      }
    },
  });

  drag(drop(ref), {});

  return (
    <animated.div
      ref={ref}
      className="m-2.5"
      style={isDraggingThisItem ? { ...style, visibility: "hidden" } : style}
    >
      <SeriesCard
        series={item}
        dragging={isDragging} // <- Pass the shared isDragging state here
        style={{ pointerEvents: isDraggingThisItem ? "none" : "auto" }}
      />
    </animated.div>
  );
};

const SeriesRow: React.FC<SeriesRowProps> = ({ series, setSeries }) => {
  const [isDragging, setDragging] = React.useState(false);

  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const dragSeries = series[dragIndex];
    const newSeries = [...series];
    newSeries.splice(dragIndex, 1);
    newSeries.splice(hoverIndex, 0, dragSeries);
    setSeries(newSeries);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <CustomDragLayer />
      <FlipMove className="flex flex-wrap">
        {series.map((item, index) => (
          <div key={item.id}>
            {" "}
            {/* Add wrapper native DOM element */}
            <DnDItem
              id={item.id}
              item={item}
              index={index}
              moveItem={moveItem}
              setDragging={setDragging}
              isDragging={isDragging}
            />
          </div>
        ))}
      </FlipMove>
    </DndProvider>
  );
};
function CustomDragLayer() {
  const { isDragging, item, initialOffset, currentOffset } = useDragLayer(
    (monitor) => ({
      item: monitor.getItem(),
      initialOffset: monitor.getInitialClientOffset(),
      currentOffset: monitor.getClientOffset(),
      isDragging: monitor.isDragging(),
    })
  );

  const style = useSpring({
    opacity: isDragging ? 1 : 0,
    transform:
      currentOffset && initialOffset
        ? `translate(${currentOffset.x - initialOffset.x}px, ${
            currentOffset.y - initialOffset.y
          }px)`
        : `translate(0px, 0px)`,
    config: { tension: 280 }, // Increase tension for faster animations
  });

  if (!isDragging || !currentOffset || !initialOffset || !item) {
    return null;
  }

  const { width, height } = item.size || { width: 0, height: 0 };

  return (
    <animated.div
      style={{
        ...style,
        position: "fixed",
        pointerEvents: "none",
        zIndex: 100,
        left: initialOffset.x - width / 2,
        top: initialOffset.y - height / 2,
      }}
      className={"cursor-pointer"}
    >
      <div className="cursor-pointer">
        <SeriesCard dragging={true} series={item.seriesItem} />
      </div>
    </animated.div>
  );
}

export default SeriesRow;
