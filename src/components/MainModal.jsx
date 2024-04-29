import { useState, forwardRef, useImperativeHandle, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import Modal from "react-bootstrap/Modal";
import { queryClient } from "../App";
import Form from "react-bootstrap/Form";
import NotificationDialog from "./NotificationDialog";
import "./MainModal.scss";

const icons = {
  add: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="35"
      height="35"
      fill="#008A2E"
      className="bi bi-shield-fill-plus"
      viewBox="0 0 16 16"
    >
      <path d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625 11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m-.5 5a.5.5 0 0 1 1 0v1.5H10a.5.5 0 0 1 0 1H8.5V9a.5.5 0 0 1-1 0V7.5H6a.5.5 0 0 1 0-1h1.5z" />
    </svg>
  ),
  view: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="35"
      height="35"
      fill="#343434"
      className="bi bi-prescription2"
      viewBox="0 0 16 16"
    >
      <path d="M7 6h2v2h2v2H9v2H7v-2H5V8h2z" />
      <path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v10.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 14.5V4a1 1 0 0 1-1-1zm2 3v10.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V4zM3 3h10V1H3z" />
    </svg>
  ),
  edit: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="35"
      height="35"
      fill="#0973DC"
      className="bi bi-pencil-fill"
      viewBox="0 0 16 16"
    >
      <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
    </svg>
  ),
};

const MainModal = forwardRef(function MainModal(
  { children, addFn, keyQuery, onSubmit, searchElement, onChange },
  ref
) {
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const notiDialogRef = useRef();
  const modalState = useRef({
    header: "",
    isEditable: true,
    size: "",
    id: null,
    action: null,
  });

  const addMutate = useMutation({
    mutationFn: addFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...keyQuery] });
      modalState.current.isEditable = false;
      setShow(() => {
        return false;
      });
      notiDialogRef.current.toastSuccess({ message: data.message });
      modalState.current.id = null;
    },
    onError: (data) => {
      notiDialogRef.current.toastError({ message: data.message });
    },
  });

  useImperativeHandle(
    ref,
    () => {
      return {
        show({ isEditable, header, id, action }) {
          modalState.current.header = header;
          modalState.current.isEditable = isEditable;
          modalState.current.action = action;
          if (id) {
            modalState.current.id = id;
          }
          setShow(true);
          setValidated(false);
        },
        close() {
          modalState.current.isEditable = false;
          modalState.current.id = null;
          setShow(() => {
            return false;
          });
          setValidated(false);
        },
        isEditable() {
          return modalState.current.isEditable;
        },
        isLarge() {
          modalState.current.size = "xl";
        },
      };
    },
    []
  );

  function closeHandler() {
    modalState.current.id = null;
    setValidated(false);
    setShow(() => {
      return false;
    });
  }

  function submitHandler(event) {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    if (!onSubmit) {
      if (modalState.current.id !== null) data.id = modalState.current.id;
      addMutate.mutate({ ...data });
    } else {
      if (modalState.current.id !== null) data.id = modalState.current.id;
      onSubmit({ data, addMutate });
    }
    setValidated(false);
  }

  return (
    <>
      <NotificationDialog ref={notiDialogRef} />
      <Modal
        ref={ref}
        show={show}
        onHide={closeHandler}
        centered
        size={modalState.current.size}
        style={{ zIndex: "1050" }}
      >
        <Modal.Header
          closeButton
          className={`fw-bold text-dark fs-5 ${modalState.current.action}`}
          style={{ height: "50px" }}
        >
          <div className="title">{modalState.current.header}</div>
          {/* <Modal.Title></Modal.Title> */}
        </Modal.Header>
        <div tabIndex="-1" className="h-100">
          <div className={`h position-relative ${modalState.current.action}`}>
            <div className="position-absolute start-50 translate-middle">
              <div
                className="position-relative"
                style={{
                  height: "90px",
                  width: "90px",
                  background: "#ffffff",
                  borderRadius: "45px",
                  top: "-50px",
                }}
              >
                <div className="position-absolute top-50 start-50 translate-middle">
                  <div className="position-relative shadow-sm noti-icon">
                    <div className=" position-absolute top-50 start-50 translate-middle">
                      {modalState.current.action &&
                        icons[modalState.current.action]}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal-body fw-bold h-100"
            style={{ padding: "0 0.75rem 0.75rem 0.75rem" }}
          >
            {!modalState.current.id && searchElement}
            <Form
              onChange={onChange}
              onSubmit={submitHandler}
              noValidate
              validated={validated}
              className="h-100"
            >
              {children}
            </Form>
          </div>
        </div>
      </Modal>
    </>
  );
});

export default MainModal;
