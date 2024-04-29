import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchMaxNumberOfPatients,
  fetchFeeConsult,
  updateFeeConsult,
  updateMaxNumberOfPatients,
} from "../../services/argument";
import Card from "../../components/Card";
import { useRef, useState } from "react";
import { queryClient } from "../../App";
import { Form } from "react-bootstrap";
import NotificationDialog, {
  DialogAction,
} from "../../components/NotificationDialog";

function PrincipleView() {
  const [dataState, setDataState] = useState({
    maxpatients: null,
    feeconsult: null,
    isEditable: false,
  });
  const [validated, setValidated] = useState(false);
  const notiDialogRef = useRef();

  const maxpatientsQuery = useQuery({
    queryKey: ["maxpatients"],
    queryFn: async () => {
      const res = (await fetchMaxNumberOfPatients()) ?? 0;
      setDataState((prevState) => {
        return {
          ...prevState,
          maxpatients: res,
        };
      });
      return res;
    },
  });

  const feeConsultQuery = useQuery({
    queryKey: ["feeconsult"],
    queryFn: async () => {
      const res = (await fetchFeeConsult()) ?? 0;
      setDataState((prevState) => {
        return {
          ...prevState,
          feeconsult: res,
        };
      });
      return res;
    },
  });

  const maxPatientsMutate = useMutation({
    mutationFn: updateMaxNumberOfPatients,
  });

  const feeConsultMutate = useMutation({
    mutationFn: updateFeeConsult,
  });

  function submitHanlder(event) {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    if (data.maxpatients !== maxpatientsQuery.data) {
      const maxnumberofpatients = data.maxpatients;
      maxPatientsMutate.mutate({ maxNumberOfPatients: maxnumberofpatients });
    }

    if (data.feeconsult !== feeConsultQuery.data) {
      const feeconsult = data.feeconsult;
      feeConsultMutate.mutate({ feeConsult: feeconsult });
    }
    notiDialogRef.current.setDialogData({
      action: DialogAction.UPDATE,
    });
    if (maxPatientsMutate.isError || feeConsultMutate.isError) {
      notiDialogRef.current.toastError({message:"Cập nhật quy định thất bại"});
    } else {
      notiDialogRef.current.toastSuccess({message:"Cập nhật quy định thành công"});
    }

    setDataState(() => {
      return {
        isEditable: false,
        feeconsult: data.feeconsult,
        maxpatients: data.maxpatients,
      };
    });
    setValidated(false);
  }

  function editHandler() {
    setDataState((prevState) => {
      return {
        ...prevState,
        isEditable: true,
      };
    });
  }

  function cancelHandler() {
    queryClient.invalidateQueries({ queryKey: ["feeconsult"] });
    queryClient.invalidateQueries({ queryKey: ["maxpatients"] });
    setDataState((prevState) => {
      return {
        ...prevState,
        isEditable: false,
      };
    });
  }

  function onChangeHandler({ event, name }) {
    if (name === "feeconsult") {
      setDataState((prevState) => {
        return {
          ...prevState,
          feeconsult: event.target.value,
        };
      });
    }

    if (name == "maxpatients") {
      setDataState((prevState) => {
        return {
          ...prevState,
          maxpatients: event.target.value,
        };
      });
    }
  }

  return (
    <div className="col h-100">
      <NotificationDialog ref={notiDialogRef} keyQuery={[]} />
      <div
        className="h-100 position-relative"
        style={{ backgroundColor: "#E9ECEF" }}
      >
        <div className="position-absolute top-50 mt-50 start-50 translate-middle">
          <Card>
            <div className="col fw-bold fs-4 text-center text-black">
              <label>Quy Định Phòng Khám</label>
            </div>
            <div>
              <Form
                onSubmit={submitHanlder}
                noValidate
                validated={validated}
                className="h-100"
              >
                <div className="row fw-bold">
                  <label
                    htmlFor="maxpatients"
                    className="col-form-label text-black"
                  >
                    Số Bệnh Nhân Tối Đa Trong Ngày
                  </label>
                  <input
                    type="number"
                    id="maxpatients"
                    className="form-control fw-bold"
                    name="maxpatients"
                    value={dataState.maxpatients ?? 0}
                    disabled={!dataState.isEditable}
                    onChange={(event) =>
                      onChangeHandler({ event, name: "maxpatients" })
                    }
                    required
                  />
                </div>
                <div className="row fw-bold">
                  <label
                    htmlFor="feeconsult"
                    className="col-form-label text-black"
                  >
                    Phí Khám Bệnh
                  </label>
                  <input
                    type="number"
                    id="feeconsult"
                    className="form-control fw-bold"
                    name="feeconsult"
                    value={dataState.feeconsult ?? 0}
                    disabled={!dataState.isEditable}
                    onChange={(event) =>
                      onChangeHandler({ event, name: "feeconsult" })
                    }
                    required
                  />
                </div>

                <div className="d-flex gap-3 mt-3 justify-content-center">
                  {!dataState.isEditable ? (
                    <button
                      type="button"
                      className="btn btn-primary fw-bold"
                      onClick={editHandler}
                    >
                      Chỉnh sửa
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="btn btn-secondary fw-bold"
                        onClick={cancelHandler}
                      >
                        Hủy
                      </button>
                      <button type="submit" className="btn btn-primary fw-bold">
                        Lưu
                      </button>
                    </>
                  )}
                </div>
              </Form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default PrincipleView;
