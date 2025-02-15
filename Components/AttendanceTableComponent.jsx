import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, StatusBar } from "react-native";
import { useAuth } from "../Context/AuthContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import Paginate from "./Paginate";

const AttendanceTableComponent = () => {
  const { user } = useAuth();
  const studentId = user._id;
  const [attendanceData, setAttendanceData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

  const formatDate = (date) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const fetchAttendanceData = async () => {
    if (!studentId || !startDate || !endDate) {
      console.error("Missing student ID or date range");
      return;
    }

    try {
      const url = `${BACKEND_URL}/attendance/student/${studentId}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
      const response = await fetch(url);
      const data = await response.json();
      setAttendanceData(data.attendance || []);

      const totalPages = Math.ceil((data.total || 0) / ITEMS_PER_PAGE);
      setPages(totalPages);
      setPage(1);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchAttendanceData();
    }
  }, []);

  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.headerText}>Date</Text>
      <Text style={styles.headerText}>Status</Text>
      <Text style={styles.headerText}>Time In</Text>
      <Text style={styles.headerText}>Department</Text>
      <Text style={styles.headerText}>Verified By</Text>
    </View>
  );

  const renderRow = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.rowText}>{formatDate(item.date)}</Text>
      <Text style={styles.rowText}>{item.status}</Text>
      <Text style={styles.rowText}>{item.status !== 'Absent' ? formatTime(item.timeIn) : "N/A"}</Text>
      <Text style={styles.rowText}>{item.department}</Text>
      <Text style={styles.rowText}>{item.verifiedBy ? item.verifiedBy.name : "Pending"}</Text>
    </View>
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pages) {
      setPage(newPage);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#f9f9f9" barStyle="dark-content" />
      <Text style={styles.title}>Attendance Records</Text>
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.dateInput}>
          <Text style={styles.dateText}>Start Date: {formatDate(startDate)}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.dateInput}>
          <Text style={styles.dateText}>End Date: {formatDate(endDate)}</Text>
        </TouchableOpacity>
        <Button title="Fetch Attendance" onPress={fetchAttendanceData} />
      </View>

      <View style={styles.tableWrapper}>
        <View style={styles.table}>
          {renderHeader()}
          <FlatList
            data={attendanceData.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)}
            renderItem={renderRow}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={<Text style={styles.emptyText}>No attendance records found.</Text>}
            scrollEnabled={false}
          />
        </View>
      </View>

      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={(event, selectedDate) => {
            setShowStartDatePicker(false);
            if (selectedDate) setStartDate(selectedDate);
          }}
        />
      )}
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={(event, selectedDate) => {
            setShowEndDatePicker(false);
            if (selectedDate) setEndDate(selectedDate);
          }}
        />
      )}

      <View style={styles.paginationContainer}>
        <Paginate pages={pages} page={page} onPageChange={handlePageChange} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: StatusBar.currentHeight || 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  inputContainer: {
    marginBottom: 20,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  tableWrapper: {
    marginBottom: 20,
  },
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    padding: 10,
  },
  headerText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  rowText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    padding: 20,
    fontSize: 16,
  },
  paginationContainer: {
    marginTop: 10,
  },
});

export default AttendanceTableComponent;
