import { Tag, Typography } from 'antd';

const { Text } = Typography;

const Legend: React.FC = () => {
    return (
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <Text>
                <Tag color="red" style={{ marginRight: '1rem' }}>
                    Over Capacity
                </Tag>
                <Tag color="gold" style={{ marginRight: '1rem' }}>
                    Empty
                </Tag>
                <Tag color="green">
                    Normal
                </Tag>
            </Text>
        </div>
    );
};

export default Legend;