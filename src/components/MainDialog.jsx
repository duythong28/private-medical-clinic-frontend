import { useRef, forwardRef, useImperativeHandle, useState } from "react";
import MainModal from "./MainModal";
import "./MainModal.scss";

const MainDialog = forwardRef(function MainDialog(
  {
    children,
    addFn,
    editFn,
    keyQuery,
    onEdit,
    onSubmit,
    searchElement,
    onChange,
    isPasswordChanged,
    setIsPasswordChanged,
    addButton,
  },
  ref
) {
  const modalRef = useRef();
  const actionRef = useRef("");
  const [isSubmitable, setIsSubmitable] = useState(false);

  function showHandler() {
    onEdit({ data: null, isEditable: true });
    actionRef.current = "add";
    if (isPasswordChanged) {
      setIsPasswordChanged(() => false);
    }
    modalRef.current?.show({
      isEditable: true,
      header: "Thêm mới",
      action: "add",
    });
  }

  function closeHandler() {
    modalRef.current.close();
  }

  useImperativeHandle(
    ref,
    () => {
      return {
        async edit({ id, action, data }) {
          actionRef.current = action;
          let editData;
          if (id && editFn) {
            editData = await editFn({ id });
            console.log("edit data", id);
          }

          if (data) {
            editData = data;
          }

          if (action === "edit") {
            onEdit({ data: editData, isEditable: true });
            modalRef.current.show({
              isEditable: true,
              header: "Chỉnh sửa",
              id: editData?.id,
              action: action,
            });
          }
          if (action === "view") {
            onEdit({ data: editData, isEditable: false });
            modalRef.current.show({
              isEditable: false,
              header: "Chi tiết",
              action: action,
            });
          }
        },
      };
    },
    []
  );

  return (
    <div ref={ref}>
      <MainModal
        ref={modalRef}
        addFn={addFn}
        keyQuery={keyQuery}
        onSubmit={onSubmit}
        onChange={onChange}
        searchElement={searchElement}
        isPasswordChanged={isPasswordChanged}
        setIsSubmitable={setIsSubmitable}
      >
        {children}
        <div
          className={`d-flex gap-3 mt-3 justify-content-center ${actionRef.current} bg-white`}
        >
          <button
            type="button"
            className="btn button-outline shadow-sm"
            data-bs-dismiss="modal"
            onClick={closeHandler}
          >
            Đóng
          </button>
          {modalRef.current?.isEditable() && (
            <button
              type="submit"
              className="btn button fw-bold shadow-sm"
              disabled={isPasswordChanged && !isSubmitable}
            >
              Lưu
            </button>
          )}
        </div>
      </MainModal>
      {addButton && (
        <button
          type="button"
          className="col btn btn-primary float-end"
          onClick={showHandler}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-plus-lg me-2"
            viewBox="0 2 16 16"
          >
            <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
          </svg>
          Thêm mới
        </button>
      )}
    </div>
  );
});

export default MainDialog;
