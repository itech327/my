# المختبر التفاعلي «المربّع المخادع» · Le carré qui triche (3AC)

صفحة واحدة `lab.html` (720×1280) بثلاثة أوضاع: استكشف، تحدٍّ، سينما (للتصدير). التفاصيل الكاملة والحالة الراهنة في `HANDOFF-taalim-men.md`.

## الاستخدام السريع
```
python3 -m pip install playwright && python3 -m playwright install chromium   # مرة واحدة
python3 build_video.py out.mp4 [timings.json]                                  # فيديو صامت 41.5 ث
python3 retime_lab.py <dossier_wav> [out.mp4]                                  # 01.wav..08.wav ← فيديو بالصوت
python3 make_voiced.py links.txt [out.mp4]                                     # ينزّل الأسطر من voice.taalim.men ثم يشغّل ما سبق
```
- يلزم ffmpeg. المكتبات (KaTeX والخطوط) موجودة هنا، لا حاجة إلى npm.
- `voice-script.json`: نص التعليق. قاعدة القراءة: (a+b)² تُقرأ «آ زائد بي الكلّ أس اثنان».
- `links.txt`: ثمانية أسطر، رابط `voice.taalim.men/audio/<id>` (صالح 7 أيام) أو مسار ملف wav محلي.
- لا تُرفع هنا ملفات mp4 ولا wav (انظر `.gitignore`).

## نقل الصوت دون وصول للشبكة
أداة الموصل `fetch_audio` تعيد WAV كنص base64 على شرائح. ثم: `python3 unpack_audio.py out.wav slice1.txt slice2.txt ...` (ملفات نتائج الأداة المحفوظة بالترتيب). تفاصيل في `HANDOFF-taalim-men.md`، القسم 5.
