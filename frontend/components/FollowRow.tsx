import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface FollowRow {
    name: string;
    onFollow: () => void
}

const FollowRow = ({ name, onFollow }: FollowRow) => {
    return (
        <View style={styles.row}>
            <Text style={styles.name}>{name}</Text>
            <TouchableOpacity style={styles.button} onPress={onFollow}>
                <Text style={styles.buttonText}>Follow</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    name: {
        fontSize: 16,
    },
    button: {
        backgroundColor: '#1E90FF',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
});

export default FollowRow;
