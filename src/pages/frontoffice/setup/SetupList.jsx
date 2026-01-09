// pages/frontoffice/setup/SetupList.jsx
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  GraduationCap,
  MapPin,
  Calendar,
  Clock,
  ChevronUp,
  ChevronDown,
  MessageSquare,
  DollarSign,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { setupAPI } from "../../../services/api";

const SetupList = () => {
  const [activeTab, setActiveTab] = useState("qualifications");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Data states
  const [qualifications, setQualifications] = useState([]);
  const [areas, setAreas] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [batches, setBatches] = useState([]);
  const [enquiryMethods, setEnquiryMethods] = useState([]);
  const [fees, setFees] = useState([]);

  // Separate form states for each tab
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Qualification form
  const [qualificationForm, setQualificationForm] = useState({
    qualificationName: "",
    description: "",
  });

  // Area form
  const [areaForm, setAreaForm] = useState({
    areaName: "",
    pincode: "",
    city: "",
  });

  // Holiday form
  const [holidayForm, setHolidayForm] = useState({
    holidayDate: "",
    holidayName: "",
    description: "",
    isRecurring: false,
  });

  // Batch form
  const [batchForm, setBatchForm] = useState({
    batchName: "",
    startTime: "",
    endTime: "",
    order: 0,
  });

  // Enquiry Method form
  const [enquiryMethodForm, setEnquiryMethodForm] = useState({
    methodName: "",
    description: "",
    order: 0,
  });

  // Fee form
  const [feeForm, setFeeForm] = useState({
    feeName: "",
    amount: "",
    description: "",
    isActive: true,
  });

  // Validation state for fee name
  const [feeNameError, setFeeNameError] = useState("");

  useEffect(() => {
    fetchSetupData();
  }, []);

  const fetchSetupData = async () => {
    try {
      setLoading(true);
      const response = await setupAPI.getAll();
      if (response.data.success) {
        const {
          qualifications,
          areas,
          holidays,
          batches,
          enquiryMethods,
          fees,
        } = response.data.data;
        setQualifications(qualifications || []);
        setAreas(areas || []);
        setHolidays(holidays || []);
        setBatches(
          (batches || []).sort((a, b) => (a.order || 0) - (b.order || 0))
        );
        setEnquiryMethods(
          (enquiryMethods || []).sort((a, b) => (a.order || 0) - (b.order || 0))
        );
        setFees(fees || []);
      } else {
        toast.error(response.data.message || "Failed to load setup data");
      }
    } catch (error) {
      console.error("Fetch setup data error:", error);
      toast.error("Failed to load setup data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm("");
    setShowForm(false);
    setEditingId(null);
    resetForm();
  };

  const resetForm = () => {
    if (activeTab === "qualifications") {
      setQualificationForm({
        qualificationName: "",
        description: "",
      });
    } else if (activeTab === "areas") {
      setAreaForm({
        areaName: "",
        pincode: "",
        city: "",
      });
    } else if (activeTab === "holidays") {
      setHolidayForm({
        holidayDate: "",
        holidayName: "",
        description: "",
        isRecurring: false,
      });
    } else if (activeTab === "batches") {
      setBatchForm({
        batchName: "",
        startTime: "",
        endTime: "",
        order: batches.length,
      });
    } else if (activeTab === "enquiry-methods") {
      setEnquiryMethodForm({
        methodName: "",
        description: "",
        order: enquiryMethods.length,
      });
    } else if (activeTab === "fees") {
      setFeeForm({
        feeName: "",
        amount: "",
        description: "",
        isActive: true,
      });
      setFeeNameError("");
    }
  };

  // Fee name validation function
  const validateFeeName = (name) => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return "Fee name is required";
    }

    if (trimmedName.length < 2) {
      return "Fee name must be at least 2 characters";
    }

    if (trimmedName.length > 50) {
      return "Fee name must be less than 50 characters";
    }

    return "";
  };

  // Separate change handlers for each form
  const handleQualificationChange = (e) => {
    const { name, value } = e.target;
    setQualificationForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAreaChange = (e) => {
    const { name, value } = e.target;
    setAreaForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleHolidayChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHolidayForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBatchChange = (e) => {
    const { name, value } = e.target;
    setBatchForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEnquiryMethodChange = (e) => {
    const { name, value } = e.target;
    setEnquiryMethodForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeeChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "feeName") {
      const error = validateFeeName(value);
      setFeeNameError(error);
    }

    setFeeForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setShowForm(true);

    if (activeTab === "qualifications") {
      setQualificationForm({
        qualificationName: item.qualificationName || "",
        description: item.description || "",
      });
    } else if (activeTab === "areas") {
      setAreaForm({
        areaName: item.areaName || "",
        pincode: item.pincode || "",
        city: item.city || "",
      });
    } else if (activeTab === "holidays") {
      setHolidayForm({
        holidayDate: item.holidayDate
          ? new Date(item.holidayDate).toISOString().split("T")[0]
          : "",
        holidayName: item.holidayName || "",
        description: item.description || "",
        isRecurring: item.isRecurring || false,
      });
    } else if (activeTab === "batches") {
      setBatchForm({
        batchName: item.batchName || "",
        startTime: item.startTime || "",
        endTime: item.endTime || "",
        order: item.order || 0,
      });
    } else if (activeTab === "enquiry-methods") {
      setEnquiryMethodForm({
        methodName: item.methodName || "",
        description: item.description || "",
        order: item.order || 0,
      });
    } else if (activeTab === "fees") {
      setFeeForm({
        feeName: item.feeName || "",
        amount: item.amount || "",
        description: item.description || "",
        isActive: item.isActive !== undefined ? item.isActive : true,
      });
      setFeeNameError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (activeTab === "qualifications") {
        if (!qualificationForm.qualificationName.trim()) {
          toast.error("Qualification name is required");
          return;
        }

        const submitData = {
          qualificationName: qualificationForm.qualificationName.trim(),
          description: qualificationForm.description.trim() || "",
        };

        if (editingId) {
          await setupAPI.updateQualification(editingId, submitData);
          toast.success("Qualification updated successfully");
        } else {
          await setupAPI.createQualification(submitData);
          toast.success("Qualification added successfully");
        }
      } else if (activeTab === "areas") {
        if (!areaForm.areaName.trim()) {
          toast.error("Area name is required");
          return;
        }

        const submitData = {
          areaName: areaForm.areaName.trim(),
          pincode: areaForm.pincode.trim() || "",
          city: areaForm.city.trim() || "",
        };

        if (editingId) {
          await setupAPI.updateArea(editingId, submitData);
          toast.success("Area updated successfully");
        } else {
          await setupAPI.createArea(submitData);
          toast.success("Area added successfully");
        }
      } else if (activeTab === "holidays") {
        if (!holidayForm.holidayDate || !holidayForm.holidayName.trim()) {
          toast.error("Holiday date and name are required");
          return;
        }

        const submitData = {
          holidayDate: holidayForm.holidayDate,
          holidayName: holidayForm.holidayName.trim(),
          description: holidayForm.description.trim() || "",
          isRecurring: holidayForm.isRecurring || false,
        };

        if (editingId) {
          await setupAPI.updateHoliday(editingId, submitData);
          toast.success("Holiday updated successfully");
        } else {
          await setupAPI.createHoliday(submitData);
          toast.success("Holiday added successfully");
        }
      } else if (activeTab === "batches") {
        if (
          !batchForm.batchName.trim() ||
          !batchForm.startTime ||
          !batchForm.endTime
        ) {
          toast.error("Batch name, start time and end time are required");
          return;
        }

        const submitData = {
          batchName: batchForm.batchName.trim(),
          startTime: batchForm.startTime,
          endTime: batchForm.endTime,
          order: parseInt(batchForm.order) || batches.length,
        };

        if (editingId) {
          await setupAPI.updateBatch(editingId, submitData);
          toast.success("Batch updated successfully");
        } else {
          await setupAPI.createBatch(submitData);
          toast.success("Batch added successfully");
        }
      } else if (activeTab === "enquiry-methods") {
        if (!enquiryMethodForm.methodName.trim()) {
          toast.error("Method name is required");
          return;
        }

        const submitData = {
          methodName: enquiryMethodForm.methodName.trim(),
          description: enquiryMethodForm.description.trim() || "",
          order: parseInt(enquiryMethodForm.order) || enquiryMethods.length,
        };

        if (editingId) {
          await setupAPI.updateEnquiryMethod(editingId, submitData);
          toast.success("Enquiry method updated successfully");
        } else {
          await setupAPI.createEnquiryMethod(submitData);
          toast.success("Enquiry method added successfully");
        }
      } else if (activeTab === "fees") {
        const trimmedFeeName = feeForm.feeName.trim();

        if (!trimmedFeeName) {
          toast.error("Fee name is required");
          return;
        }

        if (feeNameError) {
          toast.error(feeNameError);
          return;
        }

        if (!feeForm.amount || parseFloat(feeForm.amount) <= 0) {
          toast.error("Valid amount is required");
          return;
        }

        const submitData = {
          feeName: trimmedFeeName,
          amount: parseFloat(feeForm.amount),
          description: feeForm.description.trim() || "",
          isActive: feeForm.isActive,
        };

        if (editingId) {
          await setupAPI.updateFee(editingId, submitData);
          toast.success("Fee updated successfully");
        } else {
          await setupAPI.createFee(submitData);
          toast.success("Fee added successfully");
        }
      }

      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchSetupData();
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.response?.data?.message || "Failed to save data");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      if (activeTab === "qualifications") {
        await setupAPI.deleteQualification(id);
        toast.success("Qualification deleted successfully");
      } else if (activeTab === "areas") {
        await setupAPI.deleteArea(id);
        toast.success("Area deleted successfully");
      } else if (activeTab === "holidays") {
        await setupAPI.deleteHoliday(id);
        toast.success("Holiday deleted successfully");
      } else if (activeTab === "batches") {
        await setupAPI.deleteBatch(id);
        toast.success("Batch deleted successfully");
      } else if (activeTab === "enquiry-methods") {
        await setupAPI.deleteEnquiryMethod(id);
        toast.success("Enquiry method deleted successfully");
      } else if (activeTab === "fees") {
        await setupAPI.deleteFee(id);
        toast.success("Fee deleted successfully");
      }
      fetchSetupData();
    } catch (error) {
      toast.error("Failed to delete. Please try again.");
    }
  };

  const handleBatchOrder = async (id, direction) => {
    const batchIndex = batches.findIndex((b) => b._id === id);
    if (
      (direction === "up" && batchIndex === 0) ||
      (direction === "down" && batchIndex === batches.length - 1)
    )
      return;

    const newBatches = [...batches];
    const newOrder = direction === "up" ? batchIndex - 1 : batchIndex + 1;

    [newBatches[batchIndex], newBatches[newOrder]] = [
      newBatches[newOrder],
      newBatches[batchIndex],
    ];

    const updatedBatches = newBatches.map((batch, index) => ({
      id: batch._id,
      order: index,
    }));

    try {
      await setupAPI.updateBatchOrder({ batches: updatedBatches });
      setBatches(newBatches);
      toast.success("Batch order updated");
    } catch (error) {
      toast.error("Failed to update order");
    }
  };

  const handleEnquiryMethodOrder = async (id, direction) => {
    const methodIndex = enquiryMethods.findIndex((m) => m._id === id);
    if (
      (direction === "up" && methodIndex === 0) ||
      (direction === "down" && methodIndex === enquiryMethods.length - 1)
    )
      return;

    const newMethods = [...enquiryMethods];
    const newOrder = direction === "up" ? methodIndex - 1 : methodIndex + 1;

    [newMethods[methodIndex], newMethods[newOrder]] = [
      newMethods[newOrder],
      newMethods[methodIndex],
    ];

    const updatedMethods = newMethods.map((method, index) => ({
      id: method._id,
      order: index,
    }));

    try {
      await setupAPI.updateEnquiryMethodOrder({
        enquiryMethods: updatedMethods,
      });
      setEnquiryMethods(newMethods);
      toast.success("Enquiry method order updated");
    } catch (error) {
      toast.error("Failed to update order");
    }
  };

  const getFilteredData = () => {
    let data = [];
    if (activeTab === "qualifications") data = qualifications;
    else if (activeTab === "areas") data = areas;
    else if (activeTab === "holidays") data = holidays;
    else if (activeTab === "batches") data = batches;
    else if (activeTab === "enquiry-methods") data = enquiryMethods;
    else if (activeTab === "fees") data = fees;

    if (searchTerm) {
      return data.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    return data;
  };

  const renderTable = () => {
    const data = getFilteredData();

    if (activeTab === "qualifications") {
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.qualificationName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.description || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === "areas") {
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Area Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  City
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pincode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.areaName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.city || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.pincode || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === "holidays") {
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Holiday Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recurring
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.holidayDate
                      ? new Date(item.holidayDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.holidayName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.description || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.isRecurring
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.isRecurring ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === "batches") {
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time Slot
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.batchName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.displayName || `${item.startTime} to ${item.endTime}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.order}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleBatchOrder(item._id, "up")}
                        className="text-gray-600 hover:text-gray-800 p-1.5 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={
                          batches.findIndex((b) => b._id === item._id) === 0
                        }
                        title="Move Up"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        onClick={() => handleBatchOrder(item._id, "down")}
                        className="text-gray-600 hover:text-gray-800 p-1.5 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={
                          batches.findIndex((b) => b._id === item._id) ===
                          batches.length - 1
                        }
                        title="Move Down"
                      >
                        <ChevronDown size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === "enquiry-methods") {
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.methodName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.description || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.order}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEnquiryMethodOrder(item._id, "up")}
                        className="text-gray-600 hover:text-gray-800 p-1.5 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={
                          enquiryMethods.findIndex(
                            (m) => m._id === item._id
                          ) === 0
                        }
                        title="Move Up"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        onClick={() =>
                          handleEnquiryMethodOrder(item._id, "down")
                        }
                        className="text-gray-600 hover:text-gray-800 p-1.5 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={
                          enquiryMethods.findIndex(
                            (m) => m._id === item._id
                          ) ===
                          enquiryMethods.length - 1
                        }
                        title="Move Down"
                      >
                        <ChevronDown size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === "fees") {
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.feeName}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ₹{parseFloat(item.amount || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.description || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };

  const renderForm = () => {
    if (!showForm) return null;

    const getFormTitle = () => {
      if (activeTab === "qualifications") return "Qualification";
      if (activeTab === "areas") return "Area";
      if (activeTab === "holidays") return "Holiday";
      if (activeTab === "batches") return "Batch";
      if (activeTab === "enquiry-methods") return "Enquiry Method";
      if (activeTab === "fees") return "Fee";
      return "Item";
    };

    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            {editingId ? `Edit ${getFormTitle()}` : `Add New ${getFormTitle()}`}
          </h3>
          <button
            onClick={() => {
              setShowForm(false);
              setEditingId(null);
              resetForm();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {activeTab === "qualifications" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualification Name *
                </label>
                <input
                  type="text"
                  name="qualificationName"
                  value={qualificationForm.qualificationName}
                  onChange={handleQualificationChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Bachelor's Degree"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={qualificationForm.description}
                  onChange={handleQualificationChange}
                  rows="3"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional description..."
                />
              </div>
            </div>
          )}

          {activeTab === "areas" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area Name *
                </label>
                <input
                  type="text"
                  name="areaName"
                  value={areaForm.areaName}
                  onChange={handleAreaChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Downtown"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={areaForm.city}
                  onChange={handleAreaChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., New York"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={areaForm.pincode}
                  onChange={handleAreaChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 110001"
                />
              </div>
            </div>
          )}

          {activeTab === "holidays" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Holiday Date *
                </label>
                <input
                  type="date"
                  name="holidayDate"
                  value={holidayForm.holidayDate}
                  onChange={handleHolidayChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Holiday Name *
                </label>
                <input
                  type="text"
                  name="holidayName"
                  value={holidayForm.holidayName}
                  onChange={handleHolidayChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Diwali"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={holidayForm.description}
                  onChange={handleHolidayChange}
                  rows="2"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional description..."
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isRecurring"
                    checked={holidayForm.isRecurring}
                    onChange={handleHolidayChange}
                    className="mr-3 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 font-medium">
                    Recurring Holiday (yearly)
                  </span>
                </label>
              </div>
            </div>
          )}

          {activeTab === "batches" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch Name *
                </label>
                <input
                  type="text"
                  name="batchName"
                  value={batchForm.batchName}
                  onChange={handleBatchChange}
                  required
                  placeholder="e.g., Morning Batch"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={batchForm.startTime}
                  onChange={handleBatchChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time *
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={batchForm.endTime}
                  onChange={handleBatchChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {activeTab === "enquiry-methods" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Method Name *
                </label>
                <input
                  type="text"
                  name="methodName"
                  value={enquiryMethodForm.methodName}
                  onChange={handleEnquiryMethodChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Walk-in, Phone Call, Website"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={enquiryMethodForm.order}
                  onChange={handleEnquiryMethodChange}
                  min="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Display order"
                />
              </div>
            </div>
          )}

          {activeTab === "fees" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fee Name *
                </label>
                <input
                  type="text"
                  name="feeName"
                  value={feeForm.feeName}
                  onChange={handleFeeChange}
                  required
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                    feeNameError
                      ? "border-red-500 focus:ring-red-500 focus:border-transparent"
                      : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                  }`}
                  placeholder="e.g., Double Batch Fee"
                />
                {feeNameError && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {feeNameError}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={feeForm.amount}
                  onChange={handleFeeChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 1000"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={feeForm.description}
                  onChange={handleFeeChange}
                  rows="3"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional description..."
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={feeForm.isActive}
                    onChange={handleFeeChange}
                    className="mr-3 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 font-medium">
                    Active
                  </span>
                </label>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                resetForm();
              }}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={feeNameError && activeTab === "fees"}
            >
              {editingId ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    );
  };

  const getDataCount = () => {
    const data = getFilteredData();
    return data.length;
  };

  const getTabLabel = () => {
    switch (activeTab) {
      case "qualifications":
        return "Qualifications";
      case "areas":
        return "Areas";
      case "holidays":
        return "Holidays";
      case "batches":
        return "Batches";
      case "enquiry-methods":
        return "Enquiry Methods";
      case "fees":
        return "Fees";
      default:
        return "Items";
    }
  };

  return (
    <div className="setup-list-container p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Setup Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage qualifications, areas, holidays, batches, enquiry
                methods, and fees
              </p>
            </div>
            <button
              onClick={fetchSetupData}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b">
              <nav className="flex overflow-x-auto -mb-px">
                {[
                  {
                    key: "qualifications",
                    label: "Qualifications",
                    icon: GraduationCap,
                  },
                  { key: "areas", label: "Areas", icon: MapPin },
                  { key: "holidays", label: "Holidays", icon: Calendar },
                  { key: "batches", label: "Batch Master", icon: Clock },
                  {
                    key: "enquiry-methods",
                    label: "Enquiry Methods",
                    icon: MessageSquare,
                  },
                  {
                    key: "fees",
                    label: "Fees",
                    icon: DollarSign,
                  },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => handleTabChange(tab.key)}
                    className={`flex items-center gap-2 px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab.key
                        ? "border-blue-500 text-blue-600 bg-blue-50"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                    {getFilteredData().length > 0 && (
                      <span className="ml-1 px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-700 rounded-full">
                        {getFilteredData().length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Search and Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder={`Search ${getTabLabel().toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              <Plus size={20} />
              Add {getTabLabel().slice(0, -1)}
            </button>
          )}
        </div>

        {/* Form */}
        {renderForm()}

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">
                Loading {getTabLabel().toLowerCase()}...
              </p>
            </div>
          ) : getFilteredData().length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <div className="mx-auto mb-4 text-gray-400">
                {activeTab === "qualifications" && <GraduationCap size={64} />}
                {activeTab === "areas" && <MapPin size={64} />}
                {activeTab === "holidays" && <Calendar size={64} />}
                {activeTab === "batches" && <Clock size={64} />}
                {activeTab === "enquiry-methods" && <MessageSquare size={64} />}
                {activeTab === "fees" && <DollarSign size={64} />}
              </div>
              <p className="text-xl font-medium mb-2">
                No {getTabLabel().toLowerCase()} found
              </p>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm
                  ? "Try a different search term"
                  : `No ${getTabLabel().toLowerCase()} have been added yet.`}
              </p>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus size={20} />
                  Add your first {getTabLabel().slice(0, -1)}
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">{renderTable()}</div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{getDataCount()}</span>{" "}
                  {getTabLabel().toLowerCase()}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetupList;
