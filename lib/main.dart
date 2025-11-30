import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'common/my_http_overrides.dart';
import 'common/globs.dart';
import 'common/locator.dart';
import 'common/service_call.dart';
import 'common/color_extension.dart';

import 'view/login/welcome_view.dart';
import 'view/main_tabview/main_tabview.dart';
import 'view/on_boarding/startup_view.dart';

SharedPreferences? prefs;

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  /// Web bo'lmasa — HTTP override ishlaydi
  if (!kIsWeb) {
    HttpOverrides.global = MyHttpOverrides();
  }

  /// Service locator init
  setUpLocator();

  /// Shared prefs init
  prefs = await SharedPreferences.getInstance();

  /// User login bo'lganmi?
  bool loggedIn = Globs.udValueBool(Globs.userLogin);

  if (loggedIn) {
    ServiceCall.userPayload = Globs.udValue(Globs.userPayload);
  }

  /// Loading system init
  configLoading();

  /// App run
  runApp(MyEliteApp(defaultHome: loggedIn
      ? const MainTabView()
      : const StartupView()));
}

/// EASY LOADING CONFIG
void configLoading() {
  EasyLoading.instance
    ..loadingStyle = EasyLoadingStyle.custom
    ..indicatorType = EasyLoadingIndicatorType.ring
    ..indicatorSize = 45
    ..radius = 5
    ..backgroundColor = TColor.primary
    ..progressColor = TColor.primaryText
    ..indicatorColor = Colors.yellow
    ..textColor = TColor.primaryText
    ..userInteractions = false
    ..dismissOnTap = false;
}

/// ELITE APP WITH RESPONSIVE WRAPPER
class MyEliteApp extends StatelessWidget {
  final Widget defaultHome;
  const MyEliteApp({super.key, required this.defaultHome});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "Food Delivery Elite",
      debugShowCheckedModeBanner: false,
      navigatorKey: locator<NavigationService>().navigatorKey,
      home: defaultHome,

      onGenerateRoute: (settings) {
        switch (settings.name) {
          case "welcome":
            return MaterialPageRoute(builder: (_) => const WelcomeView());
          case "home":
            return MaterialPageRoute(builder: (_) => const MainTabView());
          default:
            return MaterialPageRoute(builder: (_) => Scaffold(
              body: Center(child: Text("No route defined: ${settings.name}")),
            ));
        }
      },

      /// GLOBAL RESPONSIVE WRAPPER
      builder: (context, child) {
        return LayoutBuilder(
          builder: (context, constraints) {
            double maxWidth =
                constraints.maxWidth < 600 ? constraints.maxWidth :
                constraints.maxWidth < 1100 ? 700 : 900;

            return Center(
              child: ConstrainedBox(
                constraints: BoxConstraints(maxWidth: maxWidth),
                child: MediaQuery(
                  data: MediaQuery.of(context).copyWith(
                    textScaleFactor: 1.0,
                  ),
                  child: FlutterEasyLoading(child: child!),
                ),
              ),
            );
          },
        );
      },
    );
  }
}
