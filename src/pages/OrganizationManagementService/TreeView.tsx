import React, {useEffect, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    Select,
    TextField
} from '@mui/material';

import {OrganizationChart, OrganizationChartSelectionChangeEvent} from 'primereact/organizationchart';
import {TreeNode} from 'primereact/treenode';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import {
    fetchFindAllDepartment,
    fetchGetEmployeeHierarchy,
    fetchSaveSubordinate
} from '../../store/feature/organizationManagementSlice.tsx';
import {AppDispatch} from '../../store';
import {useDispatch} from 'react-redux';

import {IDepartment} from "../../model/OrganizationManagementService/IDepartment.tsx";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import MenuItem from "@mui/material/MenuItem";
import AddIcon from "@mui/icons-material/Add"; // PrimeReact Button bileşenini ekliyoruz

interface CustomTreeNode extends TreeNode {
    type?: string;
    data?: {
        id: number;
        image: string;
        name: string;
        email: string;
        title: string;
    };
    children?: CustomTreeNode[];
}

export default function SelectionDemo() {
    const [selection, setSelection] = useState<CustomTreeNode | null>(null);
    const [data2, setData2] = useState<CustomTreeNode[]>([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch<AppDispatch>();
    const {t} = useTranslation()
    //MODAL
    const [openAddSubordinateModal, setAddSubordinateModal] = useState(false);
    const [departments, setDepartments] = useState<IDepartment[]>([]);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState(0);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(0);

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [identityNo, setIdentityNo] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);


    const handleOpenAddSubordinateModal = () => {
        setAddSubordinateModal(true);
        setIsUpdating(false)
        dispatch(
            fetchFindAllDepartment({
                page: 0,
                size: 10000,
                searchText: '',
            })
        ).then(data => {
            setDepartments(data.payload.data);
        })

    };

    /*const handleOpenUpdateModal = async () => {
        setAddSubordinateModal(true);
        setIsUpdating(true)

        dispatch(fetchFindByIdEmployee(selectedRowIds[0])).then((data) => {
            setName(data.payload.data.name)
            setSurname(data.payload.data.surname)
            setEmail(data.payload.data.email)
            setIdentityNo(data.payload.data.identityNo)
            setPhoneNo(data.payload.data.phoneNo)
            setSelectedDepartmentId(data.payload.data.department.id)
            setSelectedManagerId(data.payload.data.manager.id)
        })
    }
    const handleUpdate = async () => {
        setIsUpdating(true)
        dispatch(fetchUpdateEmployee({
            id: selectedRowIds[0],
            name: name,
            surname: surname,
            identityNo: identityNo,
            phoneNo: phoneNo,
            managerId: selectedManagerId,
            departmentId: selectedDepartmentId
        })).then((data) => {
            if (data.payload.message === "Success") {
                setName('')
                setSurname('')
                setEmail('')
                setIdentityNo('')
                setPhoneNo('')
                setSelectedDepartmentId(0)
                setSelectedManagerId(0)
                setAddSubordinateModal(false);
                Swal.fire({
                    title: t("stockService.updated"),
                    text: t("stockService.successfullyupdated"),
                    icon: "success",
                });
                setIsUpdating(false)
            } else {

                setName('')
                setSurname('')
                setEmail('')
                setIdentityNo('')
                setPhoneNo('')
                setSelectedDepartmentId(0)
                setSelectedManagerId(0)
                setAddSubordinateModal(false);
                Swal.fire({
                    title: t("swal.error"),
                    text: data.payload.message,
                    icon: "error",
                    confirmButtonText: t("swal.ok"),
                });
                setIsUpdating(false)
            }
        })

    }*/

    const handleSaveEmployee = async () => {
        setIsSaving(true)
        dispatch(fetchSaveSubordinate({
            name: name,
            surname: surname,
            email: email,
            identityNo: identityNo,
            phoneNo: phoneNo,
            managerId: selectedEmployeeId || 0,
            departmentId: selectedDepartmentId
        }))
            .then((data) => {
                if (data.payload.message === "Success") {
                    setName('')
                    setSurname('')
                    setEmail('')
                    setIdentityNo('')
                    setPhoneNo('')
                    setAddSubordinateModal(false);
                    Swal.fire({
                        title: t("swal.success"),
                        text: t("stockService.successfullyadded"),
                        icon: "success",
                    });
                    setIsSaving(false)
                    fetchDatas();
                } else {

                    setName('')
                    setSurname('')
                    setEmail('')
                    setIdentityNo('')
                    setPhoneNo('')
                    setAddSubordinateModal(false);
                    Swal.fire({
                        title: t("swal.error"),
                        text: data.payload.message,
                        icon: "error",
                        confirmButtonText: t("swal.ok"),
                    });
                    setIsSaving(false)
                    fetchDatas();
                }
            })
    };

   /* const handleDelete = async () => {
        setIsDeleting(true);
        const result = await Swal.fire({
            title: t("swal.areyousure"),
            text: t("stockService.deleting"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: t("stockService.yesdeleteit"),
            cancelButtonText: t("stockService.cancel"),
        });
        for (let id of selectedRowIds) {
            const selectedCustomer = employees.find(
                (selectedCustomer) => selectedCustomer.id === id
            );
            if (!selectedCustomer) continue;
            try {
                if (result.isConfirmed) {
                    const data = await dispatch(fetchDeleteEmployee(selectedCustomer.id));

                    if (data.payload.message !== "Success") {
                        await Swal.fire({
                            title: t("swal.error"),
                            text: data.payload.message,
                            icon: "error",
                            confirmButtonText: t("swal.ok"),
                        });
                        setSelectedRowIds([]);
                        setIsDeleting(false);
                        return;
                    }
                }
            } catch (error) {
                localStorage.removeItem("token");
            }
        }
        if (result.isConfirmed) {
            await Swal.fire({
                title: t("stockService.deleted"),
                text: t("stockService.successfullydeleted"),
                icon: "success",
            });
        }
        setSelectedRowIds([]);
        setIsDeleting(false);
    }*/

    useEffect(() => {
        fetchDatas();
    }, [dispatch, isSaving ,isUpdating]);

    const fetchDatas = () => {
        setLoading(true);
        dispatch(fetchGetEmployeeHierarchy())
            .then((response) => {
                if (response.payload && response.payload.data) {
                    setData2(response.payload.data);
                }
            })
            .finally(() => setLoading(false));
    }

    const nodeTemplate = (node: CustomTreeNode) => (
        <div className="user-card" style={{ position: 'relative' }}>
            {/* Kullanıcı bilgileri */}
            <img alt={node.data?.name} src={`https://robohash.org/${node.data?.name}.png?size=50x50`} className="user-avatar" />
            <div className="user-info">
                <h4>{node.data?.name}</h4>
                <h5>{node.data?.email}</h5>
                <p>Department: {node.data?.title}</p>
            </div>

            {/* Seçili olan düğüme sağ üstte + butonu ekliyoruz */}
            {selection && selection.data?.name === node.data?.name && (
                <IconButton
                    color="primary"
                    size="small"
                    style={{ position: 'absolute', top: '-10px', right: '-10px' , backgroundColor: 'white',}}
                    onClick={() => handleOpenAddSubordinateModal()}
                >
                    <AddIcon /> {/* + işaretini göstermek için Material UI Add ikonu */}
                </IconButton>
            )}
        </div>
    );
    const handleSelectionChange = (e: OrganizationChartSelectionChangeEvent) => {
        setSelection(e.data as CustomTreeNode || null); // Sadece bir düğüm seçilebilir
        setSelectedEmployeeId(selection?.data?.id || 0)
    };

    return (
        <div className="card overflow-x-auto">
            {/* Yükleniyor durumunu kontrol ediyoruz */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                // Veri yüklendikten sonra OrganizationChart bileşenini render ediyoruz
                <OrganizationChart
                    value={data2}
                    selectionMode="single"
                    selection={selection}
                    onSelectionChange={handleSelectionChange}
                    nodeTemplate={nodeTemplate}
                />
            )}

            <Dialog open={openAddSubordinateModal} onClose={() => setAddSubordinateModal(false)} fullWidth
                    maxWidth='sm'>
                <DialogTitle>{isUpdating ? t('stockService.update') : t('stockService.addemployee')}</DialogTitle>
                <DialogContent>
                    <FormControl variant="outlined" sx={{width: '100%', marginTop: '15px'}}>
                        <InputLabel>{t('stockService.pleaseselectdepartment')}</InputLabel>
                        <Select
                            value={selectedDepartmentId}
                            onChange={event => setSelectedDepartmentId((Number)(event.target.value))}
                            label="Product Categories"
                        >
                            {Object.values(departments).map(department => (
                                <MenuItem key={department.id} value={department.id}>
                                    {department.name}
                                </MenuItem>
                            ))}

                        </Select>
                    </FormControl>
                    <TextField
                        sx={{marginTop: '15px'}}
                        label={t('authentication.name')}
                        name="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        fullWidth
                    />
                    <TextField
                        sx={{marginTop: '15px'}}
                        label={t('authentication.surname')}
                        name="surname"
                        value={surname}
                        onChange={e => setSurname(e.target.value)}
                        required
                        fullWidth
                    />
                    <TextField
                        sx={{marginTop: '15px'}}
                        label={t('stockService.identityno')}
                        name="identityNo"
                        value={identityNo}
                        onChange={e => setIdentityNo(e.target.value)}
                        required
                        fullWidth
                    />
                    <TextField
                        sx={{marginTop: '15px'}}
                        label={t('stockService.phoneno')}
                        name="phoneNo"
                        value={phoneNo}
                        onChange={e => setPhoneNo(e.target.value)}
                        required
                        fullWidth
                    />
                    <TextField
                        sx={{marginTop: '15px'}}
                        label="Email"
                        name="email"
                        value={email}
                        disabled={isUpdating}
                        onChange={e => setEmail(e.target.value)}
                        required
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setAddSubordinateModal(false), setIsUpdating(false)
                    }} color="error" variant="contained">{t('stockService.cancel')}</Button>

                        <Button onClick={() => handleSaveEmployee()} color="success" variant="contained"
                                disabled={name === '' || surname === '' || email === '' || identityNo === '' || phoneNo === ''  || selectedDepartmentId === 0}>{t('stockService.save')}</Button>


                </DialogActions>
            </Dialog>
        </div>
    );
}
