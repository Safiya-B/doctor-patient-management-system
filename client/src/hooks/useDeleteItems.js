import { toast } from "react-toastify";
import axios from "../api/axios";

const useDeleteItems = (endPoint) => {
  const handleDelete = async (
    selectedItems,
    setOpen,
    fetchItems,
    clearSelection
  ) => {
    try {
      const { data } = await axios.delete("/api/files", {
        data: { ids: selectedItems },
      });

      console.log(data);
      toast.success(data.message);
      setOpen(false);
      fetchItems();
      clearSelection();
    } catch (error) {
      toast.error(error.response.data.error || "cannot delete items");
    }
  };
  return { handleDelete };
};

export default useDeleteItems;
