import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        // size: 'A5',
        // flexDirection: 'row',
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
        top: 200
        // 'vertical-align': 'middle',
        //position: 'absolute',
        // top: '50%',
        // '-ms-transform': 'translateY(-50%)',
        // transform: 'translateY(-50%)',
        // backgroundColor: '#E4E4E4'
        },
    page_img: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
        top: 150
        },
    title: {
        fontSize: 24,
        textAlign: 'center',
        },
    subtitle: {
        fontSize: 16,
        margin: 12,
        },
    text: {
        margin: 12,
        fontSize: 12,
        textAlign: 'justify',
        },
    image: {
        height: 200,
        marginBottom: 30,
        // marginHorizontal: 100,
        },
    logo: {
        height: 100,
        marginBottom: 30,
        },
});


export default styles;
