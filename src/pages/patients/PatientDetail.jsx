import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Card from "../../components/Card";
import HistoryTab from "../settings/examination/HistoryTab";

import { fetchPatientById } from "../../services/patients";
import MainInput from "../../components/MainInput";
import useAuth from "../../hooks/useAuth";

export default function PatientDetail() {
  const { patientId } = useParams();
  const { auth } = useAuth();
  const permission = auth?.permission || [];
  const [dataState, setDataState] = useState({
    data: null,
    isEditable: true,
  });

  const patientDetailQuery = useQuery({
    queryKey: ["patientDetail", patientId],
    queryFn: () => fetchPatientById({ id: patientId }),
  });

  useEffect(() => {
    setDataState((prevState) => {
      return {
        ...prevState,
        data: patientDetailQuery.data,
      };
    });
  }, [patientId, patientDetailQuery.data]);

  return (
    <Card className="p-3">
      <Form className="w-100 h-100 d-flex flex-column  gap-3">
        {permission?.includes("RPatient") && (
          <div className="gap-3 row">
            <div className="col">
              <div className="row gap-3">
                <MainInput
                  name={"patientid"}
                  isEditable={false}
                  defaultValue={dataState.data && dataState.data.id}
                  label={"Mã bệnh nhân"}
                />
                <MainInput
                  name={"fullname"}
                  isEditable={false}
                  defaultValue={dataState.data && dataState.data.fullName}
                  label={"Tên bệnh nhân"}
                />

                <MainInput
                  name={"phonenumber"}
                  isEditable={false}
                  defaultValue={dataState.data && dataState.data.phoneNumber}
                  label={"Số điện thoại"}
                />
              </div>
              <div className="row gap-3">
                <MainInput
                  name={"gender"}
                  isEditable={false}
                  defaultValue={dataState.data && dataState.data.gender}
                  label={"Giới tính"}
                />
                <MainInput
                  name={"birthyear"}
                  isEditable={false}
                  defaultValue={dataState.data && dataState.data.birthYear}
                  label={"Năm sinh"}
                />
                <MainInput
                  name={"address"}
                  isEditable={false}
                  defaultValue={dataState.data && dataState.data.address}
                  label={"Địa chỉ"}
                />
              </div>
            </div>
          </div>
        )}

        {permission?.includes("RRecord") && (
          <div className="w-100 h-100 overflow-hidden">
            <HistoryTab isEditable={true} />
          </div>
        )}
      </Form>
    </Card>
  );
}
