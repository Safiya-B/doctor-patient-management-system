import { useState } from "react";

const useCheckbox = (items) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelectedItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (event) => {
    event.target.checked
      ? setSelectedItems(items.map((item) => item._id))
      : setSelectedItems([]);
  };

  const isAllSelected =
    selectedItems.length === items.length && items.length > 0;
  const isIndeterminate = selectedItems.length > 0 && !isAllSelected;
  const clearSelection = () => setSelectedItems([]);

  return {
    selectedItems,
    handleSelectedItem,
    handleSelectAll,
    isAllSelected,
    isIndeterminate,
    clearSelection,
  };
};

export default useCheckbox;
