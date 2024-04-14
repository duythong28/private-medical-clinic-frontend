import MainDialog from "../../../components/MainDialog";
import { createAppointmentPatientList } from "../../../services/appointmentListPatients";
import { fetchOnePatient } from "../../../services/patients";
import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { inputDateFormat } from "../../../util/date";

const ExaminationModal = forwardRef(function ExaminationModal(
  { children },
  ref
) {
  const searchRef = useRef();
  const dialogRef = useRef();
  const [dialogState, setDialogState] = useState({
    data: null,
    isEditable: true,
  });

  useImperativeHandle(
    ref,
    () => {
      return {
        edit({ data }) {
          const appointmentInfo = {
            scheduleDate: data?.appointmentList?.scheduleDate,
            patientId: data?.patientId,
            fullName: data?.patient?.fullName,
            phoneNumber: data?.patient?.phoneNumber,
            address: data?.patient?.address,
            birthYear: data?.patient?.birthYear,
            gender: data?.patient?.gender,
            id: data?.id,
          };
          dialogRef.current.edit({
            action: "edit",
            data: appointmentInfo,
          });
        },
      };
    },
    []
  );

  async function submitHandler({ data, addMutate }) {
    if (data.id) {
      addMutate.mutate({
        scheduledate: data?.scheduledate,
        patientInfo: {
          ...data,
        },
        appointmentData: {
          id: data.id,
          patientId: data.patientid,
        },
      });
    } else {
      addMutate.mutate({
        scheduledate: data?.scheduledate,
        patientInfo: {
          ...data,
        },
      });
    }
  }

  async function searchHandler() {
    const formData = new FormData(searchRef.current);
    const searchData = Object.fromEntries(formData);
    const name = searchData.name;
    const phoneNumber = searchData.phonenumber;
    const resData = await fetchOnePatient({
      name: name,
      phoneNumber: phoneNumber,
    });

    setDialogState((prevState) => {
      return {
        ...prevState,
        data: (resData && resData[0]) || null,
      };
    });
  }

  function setData({ data, isEditable }) {
    setDialogState((prevState) => {
      return {
        ...prevState,
        data: data,
        isEditable: isEditable,
      };
    });
  }

  const searchElement = (
    <>
      {!dialogState.data?.appointmentId && (
        <div className="mt-3">
          <form ref={searchRef} className="row gap-3" onChange={searchHandler}>
            <div className="col input-group flex-nowrap">
              <span
                className="input-group-text"
                id="addon-wrapping"
                style={{ backgroundColor: "white" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-search"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
              </span>
              <input
                name="name"
                type="search"
                className="form-control"
                placeholder="Tên bệnh nhân"
                aria-describedby="addon-wrapping"
              />
            </div>
            <div className="col input-group flex-nowrap">
              <span
                className="input-group-text"
                id="addon-wrapping"
                style={{ backgroundColor: "white" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-search"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
              </span>
              <input
                type="search"
                name="phonenumber"
                className="form-control"
                placeholder="Số điện thoại"
                aria-label="medicine"
                aria-describedby="addon-wrapping"
              />
            </div>
          </form>
        </div>
      )}
    </>
  );


  return (
    <div className=" w-100  d-flex flex-row justify-content-around">
      <div className="col fw-bold fs-4">
        <label>Danh sách ca khám</label>
      </div>
      <div className="col">
        <MainDialog
          ref={dialogRef}
          addFn={createAppointmentPatientList}
          onEdit={setData}
          onSubmit={submitHandler}
          keyQuery={["appointmentList"]}
          searchElement={searchElement}
        >
          <div className="row">
            <label className="col-form-label fw-bold">
              THÔNG TIN BỆNH NHÂN
            </label>
          </div>
          <div className="row gap-3">
            <div className="col">
              <label htmlFor="patientid" className="col-form-label fw-bold">
                Mã bệnh nhân
              </label>
              <input
                type="text"
                className="form-control"
                id="patientid"
                name="patientid"
                readOnly={true}
                defaultValue={dialogState.data?.patientId ?? ""}
              />
            </div>
            <div className="col">
              <label htmlFor="fullname" className="col-form-label fw-bold">
                Tên bệnh nhân
              </label>
              <input
                type="text"
                className="form-control"
                id="fullname"
                name="fullname"
                disabled={!dialogState.isEditable}
                readOnly={dialogState.data}
                defaultValue={dialogState.data?.fullName ?? ""}
                required
              />
            </div>
            <div className="col">
              <label htmlFor="phonenumber" className="col-form-label fw-bold">
                Số điện thoại
              </label>
              <input
                className="form-control"
                id="phonenumber"
                name="phonenumber"
                type="tel"
                defaultValue={dialogState.data?.phoneNumber ?? ""}
                disabled={!dialogState.isEditable}
                readOnly={dialogState.data}
                required
              ></input>
            </div>
          </div>
          <div className="row gap-3">
            <div className="col">
              <label htmlFor="gender" className="col-form-label fw-bold">
                Giới tính
              </label>
              <select
                className="form-select"
                id="gender"
                name="gender"
                defaultValue={dialogState.data?.gender ?? ""}
                disabled={!dialogState.isEditable}
                readOnly={dialogState.data}
                value={dialogState.data?.gender}
                required
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
            <div className="col">
              <label htmlFor="birthyear" className="col-form-label fw-bold">
                Năm sinh
              </label>
              <input
                className="form-control"
                id="birthyear"
                name="birthyear"
                type="number"
                defaultValue={dialogState.data?.birthYear ?? ""}
                disabled={!dialogState.isEditable}
                readOnly={dialogState.data}
                required
                min="0"
                max={new Date().getFullYear()}
              ></input>
            </div>
            <div className="col">
              <label htmlFor="address" className="col-form-label fw-bold">
                Địa chỉ
              </label>
              <input
                className="form-control"
                id="address"
                name="address"
                defaultValue={dialogState.data?.address ?? ""}
                disabled={!dialogState.isEditable}
                readOnly={dialogState.data}
                required
              ></input>
            </div>
          </div>
          <div className="row">
            <label className="col-form-label fw-bold">THÔNG TIN CA KHÁM</label>
          </div>
          <div className="row">
            <div>
              <label htmlFor="scheduledate" className="col-form-label fw-bold">
                Ngày khám
              </label>
              <input
                className="form-control"
                type="date"
                name="scheduledate"
                id="scheduledate"
                defaultValue={
                  inputDateFormat(dialogState.data?.scheduleDate) ?? ""
                }
                required
              ></input>
            </div>
          </div>
        </MainDialog>
      </div>
    </div>
  );
});

export default ExaminationModal;
