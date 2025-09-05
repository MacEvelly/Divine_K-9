import React from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const SwipeableItem = ({ item, onRemove }) => {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    if (info.offset.x > 25) {
      onRemove();
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  return (
    <motion.li
      layout
     // initial={{ opacity: 0, y: 20 }}
     // animate={{ opacity: 1, y: 0 }}
     // exit={{ opacity: 0, x: 300, transition: { duration: 0.3 } }}
    >
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 200 }}
        dragElastic={0.1}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        animate={{ x: 0, scale: isDragging ? 0.95 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        whileTap={{ cursor: "grabbing" }}
        aria-label={`Swipe to complete: ${item.trick}`}
      >
        <div>
          <h2>{item.trick}</h2>
          {item.description && <p>{item.description}</p>}
        </div>
      </motion.div>
    </motion.li>
  );
};

SwipeableItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    trick: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default SwipeableItem;
