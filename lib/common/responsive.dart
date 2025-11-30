import 'package:flutter/material.dart';

class Responsive {
  // ekran o'lchami
  static Size size(BuildContext context) => MediaQuery.of(context).size;
  static double w(BuildContext context) => size(context).width;
  static double h(BuildContext context) => size(context).height;

  // foiz bo'yicha width/height
  static double wp(BuildContext context, double p) => w(context) * p;
  static double hp(BuildContext context, double p) => h(context) * p;

  // breakpointlar
  static bool isMobile(BuildContext context) => w(context) < 600;
  static bool isTablet(BuildContext context) =>
      w(context) >= 600 && w(context) < 1100;
  static bool isDesktop(BuildContext context) => w(context) >= 1100;
}
