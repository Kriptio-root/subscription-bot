import { config } from 'dotenv'
import { Container } from 'inversify'

import {
  BotCommandsInitializer,
  BotEventHandler,
  BotReceiver,
  BotServiceFactory,
  CommandFactory,
  HistoryManager,
  MessageProcessor,
  SendMessageComposer,
  UserMessageServiceInvoker,
  BotAdapter,
  PinoLogger,
  StartCommand,
  ResponseFormatter,
  ResponseParser,
  RequestProcessor,
  RequestHandler,
  ApiEndpointComposer,
  ReplyKeyboard,
  WorkingFieldsInitializer,
  UserLocationHandler,
  ChatIdHandler,
  MessageToCommandHandler,
  UserNameHandler,
  PrismaService,
  UpdateLocationCommand,
  UpdateTimeCommand,
  SubscribeCommand,
  UnsubscribeCommand,
  WrongCommand,
  ActiveUserTrack,
  UserTimeHandler,
  Timers,
  UserListCache,
  KeyboardCreator,
  KeyboardInlineButtonCreator,
  AlreadySubscribedCommand, ErrorWithoutAdditionalHandling
} from '../entities'
import {
  KeyboardButtonCreator
} from '../entities/client/keyboard/keyboard-buttons-generator'
import {
  InlineKeyboard
} from '../entities/client/keyboard/keyboard-types/inline-keyboard'
import {
  ErrorInstanceAdapter
} from '../entities/errors/error-instance-typescript-adapter'
import {
  UserNotificationScheduler
} from '../entities/services/cron/user-notification-scheduler'

import type {
  IBotAdapter,
  IBotCommandsInitializer,
  IBotEventHandler,
  IBotReceiver,
  IBotServiceFactory,
  ICommand,
  ICommandFactory,
  IHistoryManager,
  ILogger,
  IMessageProcessor,
  IPinoPrettyConfiguration,
  IPinoRegularConfiguration,
  ISendMessageComposer,
  IUserMessageServiceInvoker,
  IKeyboardButtonCreator,
  IResponseFormatter,
  IResponseParser,
  IRequestProcessor,
  IRequestHandler,
  IApiEndpointComposer,
  IReplyKeyboard,
  IMessageFieldsHandler,
  IDB,
  IActiveUserTrack,
  IState,
  IUserContext,
  IStateManager,
  ITimers,
  IUserListCache,
  IConfiguration,
  IKeyboardCreator,
  IInlineKeyboard,
  IKeyboardInlineButtonsCreator, IUserNotificationScheduler
} from '../interfaces'
import type {
  IErrorWithoutAdditionalHandling
} from '../interfaces/i-error-without-additional-handling'
import {
  ReadyToSubscribeState,
  WaitingForLocationState,
  WaitingForNotificationTimeState,
  UserContext,
  StateManager,
  ReadyToUpdateLocationState,
  ReadyToUpdateNotificationTimeState,
  WaitingForNotificationTimeUpdateState,
  WaitingForLocationUpdateState,
  InitialUserUpdateLocationState,
  InitialUserUpdateTimeState
} from '../state'
import { InitialUserState } from '../state/initial-user-state'
import userCommands from '../types/commands/user-commands'
import possibleEvents from '../types/events/possible-events-array'
import { SERVICE_IDENTIFIER } from '../types/identifiers'
import 'reflect-metadata'
import pinoPrettyConfig from '../types/logger/pino-pretty-config'
import pinoRegularConfig from '../types/logger/pino-regular-config'
import configuration from './configuration'

config()

const container: Container = new Container()

container
  .bind<string[]>(SERVICE_IDENTIFIER.PossibleEventsArray)
  .toConstantValue(possibleEvents)

container
  .bind<string[]>(SERVICE_IDENTIFIER.UserCommands)
  .toConstantValue(userCommands)

container
  .bind<IPinoPrettyConfiguration>(SERVICE_IDENTIFIER.IPinoPrettyConfiguration)
  .toConstantValue(pinoPrettyConfig)

container
  .bind<IPinoRegularConfiguration>(SERVICE_IDENTIFIER.IPinoRegularConfiguration)
  .toConstantValue(pinoRegularConfig)

container
  .bind<IConfiguration>(SERVICE_IDENTIFIER.IConfiguration)
  .toConstantValue(configuration)

container
  .bind<IBotAdapter>(SERVICE_IDENTIFIER.IBotAdapter)
  .to(BotAdapter)
  .inSingletonScope()

container
  .bind<IBotCommandsInitializer>(SERVICE_IDENTIFIER.IBotCommandsInitializer)
  .to(BotCommandsInitializer)

container
  .bind<IBotReceiver>(SERVICE_IDENTIFIER.IBotReceiver)
  .to(BotReceiver)

container
  .bind<ISendMessageComposer>(SERVICE_IDENTIFIER.ISendMessageComposer)
  .to(SendMessageComposer)

container
  .bind<ICommandFactory>(SERVICE_IDENTIFIER.ICommandFactory)
  .to(CommandFactory)

container
  .bind<IHistoryManager>(SERVICE_IDENTIFIER.IHistoryManager)
  .to(HistoryManager)

container
  .bind<IUserMessageServiceInvoker>(
  SERVICE_IDENTIFIER.IUserMessageServiceInvoker
)
  .to(UserMessageServiceInvoker)

container
  .bind<IMessageProcessor>(SERVICE_IDENTIFIER.IMessageProcessor)
  .to(MessageProcessor)

container
  .bind<IBotEventHandler>(SERVICE_IDENTIFIER.IBotEventHandler)
  .to(BotEventHandler)

container
  .bind<IBotServiceFactory>(SERVICE_IDENTIFIER.IBotServiceFactory)
  .to(BotServiceFactory)

container
  .bind<IResponseFormatter>(SERVICE_IDENTIFIER.IResponseFormatter)
  .to(ResponseFormatter)

container
  .bind<IResponseParser>(SERVICE_IDENTIFIER.IResponseParser)
  .to(ResponseParser)

container
  .bind<IRequestHandler>(SERVICE_IDENTIFIER.IRequestHandler)
  .to(RequestHandler)

container
  .bind<IRequestProcessor>(SERVICE_IDENTIFIER.IRequestProcessor)
  .to(RequestProcessor)

container
  .bind<IApiEndpointComposer>(SERVICE_IDENTIFIER.IApiEndpointComposer)
  .to(ApiEndpointComposer)

container
  .bind<ILogger>(SERVICE_IDENTIFIER.ILogger)
  .to(PinoLogger)
  .inSingletonScope()

container
  .bind<ICommand>(SERVICE_IDENTIFIER.StartCommand)
  .to(StartCommand)
  .inSingletonScope()

container
  .bind<ICommand>(SERVICE_IDENTIFIER.WrongCommand)
  .to(WrongCommand)
  .inSingletonScope()

container
  .bind<ICommand>(SERVICE_IDENTIFIER.UpdateLocationCommand)
  .to(UpdateLocationCommand)
  .inSingletonScope()

container
  .bind<ICommand>(SERVICE_IDENTIFIER.UpdateTimeCommand)
  .to(UpdateTimeCommand)
  .inSingletonScope()

container
  .bind<ICommand>(SERVICE_IDENTIFIER.SubscribeCommand)
  .to(SubscribeCommand)
  .inSingletonScope()

container
  .bind<ICommand>(SERVICE_IDENTIFIER.UnsubscribeCommand)
  .to(UnsubscribeCommand)
  .inSingletonScope()

container
  .bind<ICommand>(SERVICE_IDENTIFIER.AlreadySubscribedCommand)
  .to(AlreadySubscribedCommand)
  .inSingletonScope()

container
// eslint-disable-next-line @stylistic/max-len
  .bind<IKeyboardButtonCreator>(SERVICE_IDENTIFIER.IKeyboardButtonCreator)
  .to(KeyboardButtonCreator)

container
  .bind<IReplyKeyboard>(SERVICE_IDENTIFIER.IReplyKeyboard)
  .to(ReplyKeyboard)

container
  .bind<IMessageFieldsHandler>(SERVICE_IDENTIFIER.IWorkingFieldsInitializer)
  .to(WorkingFieldsInitializer)

container
  .bind<IMessageFieldsHandler>(SERVICE_IDENTIFIER.UserLocationHandler)
  .to(UserLocationHandler)

container
  .bind<IMessageFieldsHandler>(SERVICE_IDENTIFIER.ChatIdHandler)
  .to(ChatIdHandler)

container
  .bind<IMessageFieldsHandler>(SERVICE_IDENTIFIER.MessageToCommandHandler)
  .to(MessageToCommandHandler)

container
  .bind<IMessageFieldsHandler>(SERVICE_IDENTIFIER.UserNameHandler)
  .to(UserNameHandler)

container
  .bind<IMessageFieldsHandler>(SERVICE_IDENTIFIER.UserTimeHandler)
  .to(UserTimeHandler)

container
  .bind<IDB>(SERVICE_IDENTIFIER.IDB)
  .to(PrismaService)
  .inSingletonScope()

container
  .bind<IActiveUserTrack>(SERVICE_IDENTIFIER.IActiveUserTrack)
  .to(ActiveUserTrack)
  .inSingletonScope()

container
  .bind<IState>(SERVICE_IDENTIFIER.ReadyToSubscribeState)
  .to(ReadyToSubscribeState)

container
  .bind<IState>(SERVICE_IDENTIFIER.WaitingForLocationState)
  .to(WaitingForLocationState)

container
  .bind<IState>(SERVICE_IDENTIFIER.WaitingForNotificationTimeState)
  .to(WaitingForNotificationTimeState)

container
  .bind<IState>(SERVICE_IDENTIFIER.InitialUserState)
  .to(InitialUserState)

container
  .bind<IUserContext>(SERVICE_IDENTIFIER.IUserContext)
  .to(UserContext)

container
  .bind<IStateManager>(SERVICE_IDENTIFIER.IStateManager)
  .to(StateManager)

container
  .bind<ITimers>(SERVICE_IDENTIFIER.Timers)
  .to(Timers)

container
  .bind<IUserListCache>(SERVICE_IDENTIFIER.IUserListCache)
  .to(UserListCache)
  .inSingletonScope()

container
  .bind<IKeyboardCreator>(SERVICE_IDENTIFIER.IKeyboardCreator)
  .to(KeyboardCreator)

container
  .bind<IInlineKeyboard>(SERVICE_IDENTIFIER.IInlineKeyboard)
  .to(InlineKeyboard)

container
  .bind<IKeyboardInlineButtonsCreator>(
  SERVICE_IDENTIFIER.IKeyboardInlineButtonsCreator
)
  .to(KeyboardInlineButtonCreator)

container
  .bind<IState>(SERVICE_IDENTIFIER.ReadyToUpdateLocationState)
  .to(ReadyToUpdateLocationState)

container
  .bind<IState>(SERVICE_IDENTIFIER.ReadyToUpdateNotificationTimeState)
  .to(ReadyToUpdateNotificationTimeState)

container
  .bind<IState>(SERVICE_IDENTIFIER.WaitingForNotificationTimeUpdateState)
  .to(WaitingForNotificationTimeUpdateState)

container
  .bind<IState>(SERVICE_IDENTIFIER.WaitingForLocationUpdateState)
  .to(WaitingForLocationUpdateState)

container
  .bind<IState>(SERVICE_IDENTIFIER.InitialUserUpdateLocationState)
  .to(InitialUserUpdateLocationState)

container
  .bind<IState>(SERVICE_IDENTIFIER.InitialUserUpdateTimeState)
  .to(InitialUserUpdateTimeState)

container
  .bind<IErrorWithoutAdditionalHandling>(
  SERVICE_IDENTIFIER.IErrorWithoutAdditionalHandling
)
  .to(ErrorWithoutAdditionalHandling)

container
  .bind<ErrorInstanceAdapter>(
  SERVICE_IDENTIFIER.ErrorInstanceAdapter
)
  .to(ErrorInstanceAdapter)

container
  .bind<IUserNotificationScheduler>(
  SERVICE_IDENTIFIER.IUserNotificationScheduler
)
  .to(UserNotificationScheduler)
  .inSingletonScope()

export { container }
