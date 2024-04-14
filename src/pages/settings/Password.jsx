import Card from "../../components/Card";

function PasswordView() {
  return (
    <div className="col h-100">
      <div
        className="h-100 position-relative"
        style={{ backgroundColor: "#F9F9F9" }}
      >
        <div className="position-absolute top-50 mt-50 start-50 translate-middle">
          <Card>
            <div className="col fw-bold fs-4 text-center">
              <label>Cài Đặt Mật Khẩu</label>
            </div>
            <div>
              <form>
                <div className="row fw-bold">
                  <label htmlFor="currentpassword" className="col-form-label">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="currentpassword"
                    placeholder="Mật khẩu hiện tại"
                    name="currentpassword"
                  />
                </div>
                <div className="row fw-bold">
                  <label className="col-form-label" htmlFor="newpassword">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="newpassword"
                    placeholder="Mật khẩu mới"
                    name="newpassword"
                  />
                </div>
                <div className="row fw-bold">
                  <label htmlFor="retypepassword" className="col-form-label">
                    Nhập lại mật khẩu mới
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="retypepassword"
                    placeholder="Nhập lại mật khẩu"
                    name="retypepassword"
                  />
                </div>
                <div className="d-flex gap-3 mt-3 justify-content-center">
                  <button className="btn btn-secondary fw-bold" type="button">
                    Hủy
                  </button>
                  <button className="btn btn-primary fw-bold" type="submit">
                    Lưu
                  </button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default PasswordView;
