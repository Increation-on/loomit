// src/components/quiz/QuizContent.tsx
'use client';
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.QuizContent = void 0;
var react_redux_1 = require("react-redux");
var quizSlice_1 = require("@/store/slices/quizSlice");
var react_1 = require("react");
var store_1 = require("@/store/store");
var quizApi_1 = require("@/store/api/quizApi");
var react_2 = require("next-auth/react");
var favoritesApi_1 = require("@/store/api/favoritesApi");
var react_3 = require("react");
var Skeleton_1 = require("@/components/ui/feedback/Skeleton");
var usePWA_1 = require("@/hooks/usePWA");
var QuizFinishScreen_1 = require("./QuizFinishScreen");
var Modal_1 = require("@/components/ui/feedback/Modal");
var useSaveAttempt_1 = require("@/hooks/useSaveAttempt");
var useQuizNavigation_1 = require("@/hooks/useQuizNavigation");
var QuizQuestion_1 = require("./QuizQuestion");
var Skeleton_2 = require("@/components/ui/feedback/Skeleton");
function QuizContent(_a) {
    var _this = this;
    var _b;
    var id = _a.id;
    var dispatch = react_redux_1.useDispatch();
    var currentQuestion = react_redux_1.useSelector(quizSlice_1.selectCurrentQuestion);
    var score = react_redux_1.useSelector(quizSlice_1.selectScore);
    var selectedOption = react_redux_1.useSelector(quizSlice_1.selectSelectedOption);
    var _c = react_redux_1.useSelector(quizSlice_1.selectQuizState), questions = _c.questions, answers = _c.answers, currentIndex = _c.currentIndex, isFinished = _c.isFinished, currentQuiz = _c.currentQuiz, reduxAttemptId = _c.attemptId;
    var _d = quizApi_1.useGetQuizByIdQuery(id), quizData = _d.data, quizLoading = _d.isLoading;
    var session = react_2.useSession().data;
    var _e = favoritesApi_1.useGetFavoritesQuery(undefined, { skip: !session }).data, favorites = _e === void 0 ? [] : _e;
    var toggleFavorite = favoritesApi_1.useToggleFavoriteMutation()[0];
    var _f = useQuizNavigation_1.useQuizNavigation(), redirecting = _f.redirecting, setRedirecting = _f.setRedirecting;
    var _g = useSaveAttempt_1.useSaveAttempt(id), attemptId = _g.attemptId, setAttemptId = _g.setAttemptId, startNewAttempt = _g.startNewAttempt, saveStep = _g.saveStep;
    var hideNavigation = usePWA_1.usePWA();
    var _h = react_1.useState(true), isSessionLoading = _h[0], setIsSessionLoading = _h[1];
    var _j = react_1.useState(null), selectedExplanation = _j[0], setSelectedExplanation = _j[1];
    var _k = react_1.useState(0), resetCounter = _k[0], setResetCounter = _k[1];
    react_1.useEffect(function () {
        if (hideNavigation) {
            document.body.style.overflow = 'hidden';
        }
        return function () {
            document.body.style.overflow = '';
        };
    }, [hideNavigation]);
    var favoriteIds = react_3.useMemo(function () { return new Set(favorites.map(function (fav) { return fav.quiz.id; })); }, [favorites]);
    react_1.useEffect(function () {
        if (currentQuiz && currentQuiz.id && currentQuiz.id !== id) {
            store_1.persistor.purge();
            dispatch(quizSlice_1.resetQuiz());
        }
    }, [id, currentQuiz, dispatch]);
    // 2. Эффект инициализации сессии (Абсолютный источник правды — БД)
    react_1.useEffect(function () {
        if (!quizData)
            return;
        var initializeQuiz = function () { return __awaiter(_this, void 0, void 0, function () {
            var shouldResume, res, data, e_1, startData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setIsSessionLoading(true);
                        shouldResume = quizData.activeAttemptId && resetCounter === 0;
                        if (!shouldResume) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch("/api/attempts/" + quizData.activeAttemptId)];
                    case 2:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 3:
                        data = _a.sent();
                        if (data.success && data.attempt) {
                            setAttemptId(data.attempt.id);
                            dispatch(quizSlice_1.resumeQuizFromServer({
                                quiz: { id: data.attempt.quizId, title: data.attempt.title },
                                questions: data.questions,
                                answers: data.attempt.answers,
                                currentIndex: data.attempt.currentIndex,
                                attemptId: data.attempt.id,
                                startedAt: data.attempt.startedAt
                            }));
                            setIsSessionLoading(false);
                            return [2 /*return*/];
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        console.error('Не удалось восстановить попытку с сервера, стартуем новую:', e_1);
                        return [3 /*break*/, 5];
                    case 5: return [4 /*yield*/, startNewAttempt()];
                    case 6:
                        startData = _a.sent();
                        if ((startData === null || startData === void 0 ? void 0 : startData.success) && (startData === null || startData === void 0 ? void 0 : startData.attempt) && (startData === null || startData === void 0 ? void 0 : startData.questions)) {
                            dispatch(quizSlice_1.startQuiz({
                                quiz: { id: quizData.id, title: quizData.title },
                                questions: startData.questions,
                                attemptId: startData.attempt.id
                            }));
                        }
                        setIsSessionLoading(false);
                        return [2 /*return*/];
                }
            });
        }); };
        initializeQuiz();
        // Добавили quizData в зависимости. Если данные квиза переподтянутся (например, принудительно через refetch), стейт обновится
    }, [quizData, id, dispatch, startNewAttempt, setAttemptId, resetCounter]);
    var handleConfirmAnswer = function () { return __awaiter(_this, void 0, void 0, function () {
        var isCorrect, answerData, currentActiveId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!currentQuestion || !selectedOption)
                        return [2 /*return*/];
                    isCorrect = currentQuestion.correctOptionId === selectedOption;
                    answerData = {
                        questionId: currentQuestion.id,
                        selectedOptionId: selectedOption,
                        isCorrect: isCorrect,
                        questionText: currentQuestion.text,
                        correctOptionId: currentQuestion.correctOptionId
                    };
                    dispatch(quizSlice_1.confirmAnswer());
                    currentActiveId = attemptId || reduxAttemptId;
                    if (!currentActiveId) return [3 /*break*/, 2];
                    return [4 /*yield*/, saveStep(currentActiveId, answerData)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    react_1.useEffect(function () {
        if (isFinished) {
            localStorage.removeItem("active_attempt_" + id);
        }
    }, [isFinished, id]);
    if (isFinished) {
        return (React.createElement(QuizFinishScreen_1.QuizFinishScreen, { id: id, score: score, total: questions.length, quizData: quizData, favoriteIds: favoriteIds, onToggleFavorite: function (quizId, quiz) {
                return toggleFavorite({ quizId: quizId, quiz: quiz }).unwrap();
            }, onReset: function () {
                localStorage.removeItem("active_attempt_" + id);
                dispatch(quizSlice_1.resetQuiz());
                setAttemptId(null);
                setResetCounter(function (prev) { return prev + 1; });
            }, onRedirect: function () { return setRedirecting(true); }, attemptId: attemptId || reduxAttemptId || undefined }));
    }
    if (quizLoading || isSessionLoading || !currentQuestion) {
        return React.createElement(Skeleton_2.QuizSkeleton, null);
    }
    var currentAnswer = answers.find(function (a) { return a.questionId === currentQuestion.id; });
    var isCurrentConfirmed = !!currentAnswer;
    var optionLetters = ['A', 'B', 'C', 'D'];
    var hasExplanation = (_b = currentQuestion === null || currentQuestion === void 0 ? void 0 : currentQuestion.explanation) !== null && _b !== void 0 ? _b : false;
    if (redirecting) {
        return (React.createElement("div", { className: "min-h-screen bg-(--loom-black) flex items-center justify-center" },
            React.createElement(Skeleton_1.Skeleton, { className: "h-full w-full rounded-xl" })));
    }
    return (React.createElement("div", { className: "min-h-screen bg-(--loom-black) pb-24 flex flex-col items-center mx-auto overflow-hidden " + (hideNavigation ? 'pt-10' : 'pt-16') },
        React.createElement("div", { className: "w-full max-w-2xl px-4 mb-6" },
            currentQuiz && (React.createElement("div", { className: "flex items-center justify-center gap-3 mb-2" },
                React.createElement("h1", { className: "font-bold text-(--loom-cyan) text-center mb-2 text-xl", style: {
                        maxHeight: '60px',
                        overflow: 'hidden',
                        wordBreak: 'break-word'
                    } }, currentQuiz.title))),
            React.createElement("div", { className: "flex items-center gap-4 text-(--loom-white)/60 text-sm mb-2" },
                React.createElement("span", { className: "whitespace-nowrap" },
                    "\u0412\u043E\u043F\u0440\u043E\u0441 ",
                    currentIndex + 1,
                    " \u0438\u0437 ",
                    questions.length),
                React.createElement("div", { className: "flex-1 h-1 bg-(--loom-white)/10 rounded-full overflow-hidden min-w-10" },
                    React.createElement("div", { className: "h-full bg-(--loom-cyan) transition-all duration-300", style: { width: ((currentIndex + 1) / questions.length) * 100 + "%" } })),
                React.createElement("span", { className: "text-(--loom-cyan) font-semibold whitespace-nowrap" },
                    Math.round(((currentIndex + 1) / questions.length) * 100),
                    "%"))),
        React.createElement("div", { className: "w-full max-w-2xl px-4" },
            React.createElement(QuizQuestion_1.QuizQuestion, { question: currentQuestion, currentAnswer: currentAnswer, selectedOption: selectedOption, onSelectOption: function (optionId) { return dispatch(quizSlice_1.selectOption(optionId)); }, onConfirm: handleConfirmAnswer, onNext: function () { return dispatch(quizSlice_1.nextQuestion()); }, onFinish: function () { return dispatch(quizSlice_1.finishQuiz()); }, isLast: currentIndex === questions.length - 1, currentIndex: currentIndex, total: questions.length, optionLetters: optionLetters, isPWA: hideNavigation })),
        isCurrentConfirmed && hasExplanation && (React.createElement("button", { onClick: function () { var _a; return setSelectedExplanation((_a = currentQuestion.explanation) !== null && _a !== void 0 ? _a : null); }, className: "fixed bottom-4 right-4 z-50 flex items-center justify-center w-13 h-10 rounded-full bg-(--loom-cyan)/10 hover:bg-(--loom-cyan)/20 text-(--loom-cyan) text-lg transition-colors border border-(--loom-cyan)/20 shadow-lg" }, "\uD83D\uDCA1")),
        selectedExplanation && (React.createElement(Modal_1.Modal, { isOpen: !!selectedExplanation, onClose: function () { return setSelectedExplanation(null); }, title: "\u041E\u0431\u044A\u044F\u0441\u043D\u0435\u043D\u0438\u0435" },
            React.createElement("p", { className: "text-(--loom-white)/80 leading-relaxed" }, selectedExplanation)))));
}
exports.QuizContent = QuizContent;
