import PreScriptionTab from "./PrescriptionTab";
import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { useQuery } from "@tanstack/react-query";

import { convertDate } from "../../../util/date";
import { fetchAppointmentRecordById } from "../../../services/appointmentRecords";

import MainInput from "../../../components/MainInput";
import MainTextarea from "../../../components/MainTextarea";
import MainSelect from "../../../components/MainSelect";
import MainModal from "../../../components/MainModal";
import Form from "react-bootstrap/Form";
import { fetchAllDisease } from "../../../services/diseases";

const RescordHistoryModal = forwardRef(function RescordHistoryModal(
  { children },
  ref
) {
  const modalRef = useRef();
  modalRef.current?.isLarge();
  const [dialogState, setDialogState] = useState({
    data: null,
    isEditable: false,
  });

  const [appointmentRecordData, setAppointmentRecordData] = useState(null);

  const diseasesQuery = useQuery({
    queryKey: ["diseases"],
    queryFn: fetchAllDisease,
  });

  const diseaseState = diseasesQuery.data;
  function getDiseaseName({ id }) {
    const res = diseaseState.filter((disease) => {
      return disease.id == id;
    })[0];
    return res?.diseaseName || "";
  }

  useImperativeHandle(ref, () => {
    return {
      async show({ id }) {
        const resData = await fetchAppointmentRecordById({ id });
        setAppointmentRecordData(() => {
          return { ...resData };
        });
        modalRef.current.show({ isEditable: true, header: "Lịch sử khám", action:"view" });
      },
    };
  });

  return (
    <MainModal ref={modalRef}>
      <div tabIndex="-1" className="h-100">
        <div className="modal-body h-100">
          <Form className="w-100 h-100  gap-3">
            <div className="row  gap-3">
              <div className="col">
                <div className="row gap-3">
                  <MainInput
                    name={"patientid"}
                    isEditable={dialogState.isEditable}
                    defaultValue={
                      appointmentRecordData && appointmentRecordData.id
                    }
                    label={"Mã bệnh nhân"}
                  />
                  <MainInput
                    name={"fullname"}
                    isEditable={dialogState.isEditable}
                    defaultValue={
                      appointmentRecordData &&
                      appointmentRecordData.patient.fullName
                    }
                    label={"Tên bệnh nhân"}
                  />

                  <MainInput
                    name={"phonenumber"}
                    isEditable={dialogState.isEditable}
                    defaultValue={
                      appointmentRecordData &&
                      appointmentRecordData.patient.phoneNumber
                    }
                    label={"Số điện thoại"}
                  />
                  <MainInput
                    name={"gender"}
                    isEditable={dialogState.isEditable}
                    defaultValue={
                      appointmentRecordData &&
                      appointmentRecordData.patient.gender
                    }
                    label={"Giới tính"}
                  />
                  <MainInput
                    name={"birthyear"}
                    isEditable={dialogState.isEditable}
                    defaultValue={
                      appointmentRecordData &&
                      appointmentRecordData.patient.birthYear
                    }
                    label={"Năm sinh"}
                  />
                  <MainInput
                    name={"address"}
                    isEditable={dialogState.isEditable}
                    defaultValue={
                      appointmentRecordData &&
                      appointmentRecordData.patient.address
                    }
                    label={"Địa chỉ"}
                  />
                </div>
                <div className="row gap-3 w-100">
                  <div className="col w-100">
                    <div className="row">
                      <MainInput
                        name={"appointmentid"}
                        isEditable={dialogState.isEditable}
                        defaultValue={
                          appointmentRecordData && appointmentRecordData.id
                        }
                        label={"Mã ca khám"}
                      />
                      <MainInput
                        name="scheduledate"
                        defaultValue={
                          appointmentRecordData &&
                          convertDate(
                            appointmentRecordData.appointmentList.scheduleDate
                          )
                        }
                        isEditable={dialogState.isEditable}
                        label={"Ngày khám"}
                        type={"date"}
                      />
                      <MainTextarea
                        name="symptoms"
                        defaultValue={
                          appointmentRecordData &&
                          appointmentRecordData.symptoms
                        }
                        isEditable={dialogState.isEditable}
                        label={"Triệu chứng"}
                      />
                    </div>
                  </div>
                  <div className="col w-100">
                    <MainSelect
                      name={"diagnostic"}
                      defaultValue={
                        appointmentRecordData && appointmentRecordData.diseaseId
                      }
                      isEditable={dialogState.isEditable}
                      label={"Chuẩn đoán"}
                      options={
                        diseaseState &&
                        diseaseState.map((disease) => {
                          return (
                            <option key={disease.id} value={disease.id}>
                              {disease.diseaseName}
                            </option>
                          );
                        })
                      }
                      text={
                        appointmentRecordData &&
                        getDiseaseName({
                          id: appointmentRecordData.diseaseId,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row  overflow-hidden h-100">
              <PreScriptionTab
                recordId={appointmentRecordData?.id}
                isEditable={dialogState.isEditable}
              />
            </div>
          </Form>
        </div>
      </div>
    </MainModal>
  );
});

export default RescordHistoryModal;
