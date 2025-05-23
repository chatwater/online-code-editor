import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';

(async () => {
    await imagemin(['src/assets/preview.jpg'], {
        destination: 'src/assets',
        plugins: [
            imageminJpegtran()
        ]
    });
    console.log('Images optimized');
})(); 