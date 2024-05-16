import styles from './Reports.module.scss';
import classNames from 'classnames/bind';
import { useRef, useEffect, useState } from 'react';
import Revenue from './report/Revenue/Revenue';
import Report from './report/Medicine/Medicine';
const cx = classNames.bind(styles);

function ReportsPage() {
    const [page, setPage] = useState(0);
    const handleSetPage = (newpage) => {
        setPage(newpage);
    };
    return (
        <div className={cx('content')+" d-flex flex-column w-100 h-100"}>
            <div className={cx('header') + " nav nav-pills gap-4 justify-content-center border-bottom border-2 p-2"}>
                {page != 0 ? (
                    <label
                        className={cx('payment')+" nav-link"}
                        style={{ color: "#1B59F8"}}
                        onClick={() => handleSetPage(0)}
                    >
                        Doanh thu
                    </label>
                ) : (
                    <label className={cx('payment')+ " nav-link shadow-sm bg-white"} style={{ color: '#555555' }}>
                        Doanh thu
                    </label>
                )}
                {page != 1 ? (
                    <label
                        className={cx('medicine')+" nav-link" }
                        style={{ color: '#1B59F8' }}
                        onClick={() => handleSetPage(1)}
                    >
                        Thuốc
                    </label>
                ) : (
                    <label className={cx('medicine')  + " nav-link shadow-sm bg-white"} style={{ color: '#555555' }}>
                        Thuốc
                    </label>
                )}
                
            </div>
            <div className={"row w-100 h-100 overflow-hidden"}>
                {page === 0 ? <Revenue></Revenue> : <Report></Report> }
            </div>
        </div>
    );
}

export default ReportsPage;
