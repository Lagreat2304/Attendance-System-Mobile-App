import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Paginate = ({ pages, page, keyword = "", onPageChange }) => {
  const handlePageChange = (pageNum) => {
    if (onPageChange) {
      onPageChange(pageNum);
    }
  };

  return (
    pages > 1 && (
      <View style={styles.paginationContainer}>
        {[...Array(pages).keys()].map((x) => (
          <TouchableOpacity
            key={x + 1}
            style={[
              styles.pageItem,
              x + 1 === page && styles.activePage,
            ]}
            onPress={() =>
              handlePageChange(x + 1)
            }
          >
            <Text style={styles.pageText}>{x + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  pageItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  activePage: {
    backgroundColor: '#007bff',
  },
  pageText: {
    color: '#333',
  },
  activeText: {
    color: '#fff',
  },
});

export default Paginate;
