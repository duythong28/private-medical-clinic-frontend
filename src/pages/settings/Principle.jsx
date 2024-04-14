import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchMaxNumberOfPatients,
  fetchFeeConsult,
  updateFeeConsult,
  updateMaxNumberOfPatients,
} from "../../services/argument";
import Card from "../../components/Card";
import { useState } from "react";
import { queryClient } from "../../App";

function PrincipleView() {
  const [dataState, setDataState] = useState({
    maxpatients: null,
    feeconsult: null,
    isEditable: false,
  });
  const maxpatientsQuery = useQuery({
    queryKey: ["maxpatients"],
    queryFn: async () => {
      const res = await fetchMaxNumberOfPatients() ?? 0;
      setDataState((prevState) => {
        return {
          ...prevState,
          maxpatients: res,
        };
      });
    },
  });

  const feeConsultQuery = useQuery({
    queryKey: ["feeconsult"],
    queryFn: async () => {
      const res = await fetchFeeConsult() ?? 0;
      setDataState((prevState) => {
        return {
          ...prevState,
          feeconsult: res,
        };
      });
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

    setDataState(() => {
      return {
        isEditable: false,
        maxpatients: maxPatientsMutate.data,
        feeconsult: feeConsultMutate.data,
      };
    });
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
      <div
        className="h-100 position-relative"
        style={{ backgroundColor: "#F9F9F9" }}
      >
        <div className="position-absolute top-50 mt-50 start-50 translate-middle">
          <Card>
            <div className="col fw-bold fs-4 text-center">
              <label>Quy Định Phòng Khám</label>
            </div>
            <div>
              <form onSubmit={submitHanlder}>
                <div className="row fw-bold">
                  <label htmlFor="maxpatients" className="col-form-label">
                    Số Bệnh Nhân Tối Đa Trong Ngày
                  </label>
                  <input
                    type="number"
                    id="maxpatients"
                    className="form-control"
                    name="maxpatients"
                    value={dataState.maxpatients}
                    disabled={!dataState.isEditable}
                    onChange={(event) =>
                      onChangeHandler({ event, name: "maxpatients" })
                    }
                    required
                  />
                </div>
                <div className="row fw-bold">
                  <label htmlFor="feeconsult" className="col-form-label">
                    Phí Khám Bệnh
                  </label>
                  <input
                    type="number"
                    id="feeconsult"
                    className="form-control"
                    name="feeconsult"
                    value={dataState.feeconsult}
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
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default PrincipleView;
