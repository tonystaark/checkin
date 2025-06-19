import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { User } from "../types/index"

interface FollowRow {
    followerFound: User;
    userFound: User;
    onFollow: () => void
}

const FollowRow = ({ followerFound, userFound, onFollow }: FollowRow) => {
    const checkUserAlreadyFollowed = () => followerFound.followers?.includes(userFound.id)
    const isAlreadyFollowed = checkUserAlreadyFollowed() ? true : false
    return (
        <View style={styles.row}>
            <Text style={styles.name}>{followerFound.firstName}</Text>
            <Button title={isAlreadyFollowed ? "followed" : "follow"} onPress={onFollow} disabled={isAlreadyFollowed} />
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
