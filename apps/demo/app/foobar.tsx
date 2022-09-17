import { Platform, View, Text } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { SearchView } from '../components/SearchBar';

// Learn more: TODO
export default function App() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <Text style={{
                fontSize: 96,
                fontWeight: 'bold',
                ...Platform.select({
                    web: {
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        textFillColor: 'transparent',
                        color: 'transparent',
                        backgroundImage: 'linear-gradient(90deg,#0DFBFF,#FFCD6C,#FF4CFF)'
                    },
                    default: {
                        color: '#FF4CFF'
                    }
                })
            }}>{__filename}</Text>
            {/* <SearchView /> */}
        </View>
    );
}