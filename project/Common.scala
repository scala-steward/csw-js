import org.scalafmt.sbt.ScalafmtPlugin.autoImport.scalafmtOnCompile
import sbt.Keys._
import sbt._
import sbt.plugins.JvmPlugin

object Common extends AutoPlugin {

  override def trigger: PluginTrigger = allRequirements

  override def requires: Plugins = JvmPlugin

  val detectCycles: SettingKey[Boolean] = settingKey[Boolean]("is cyclic check enabled?")

  override lazy val projectSettings: Seq[Setting[_]] = Seq(
    organization := "com.github.tmtsoftware.csw-js",
    organizationName := "TMT Org",
    scalaVersion := Libs.ScalaVersion,
    concurrentRestrictions in Global += Tags.limit(Tags.All, 1),
    homepage := Some(url("https://github.com/tmtsoftware/csw-js")),
    resolvers ++= Seq(
      "jitpack" at "https://jitpack.io"
    ),
    scmInfo := Some(
      ScmInfo(url("https://github.com/tmtsoftware/csw-js"), "git@github.com:tmtsoftware/csw-js.git")
    ),
    licenses := Seq(("Apache-2.0", url("http://www.apache.org/licenses/LICENSE-2.0"))),
    scalacOptions ++= Seq(
      "-encoding",
      "UTF-8",
      "-feature",
      "-unchecked",
      "-deprecation",
      "-Xlint",
//      "-Yno-adapted-args",
      "-Ywarn-dead-code"
    ),
    javacOptions in (Compile, doc) ++= Seq("-Xdoclint:none"),
    version := {
      sys.props.get("prod.publish") match {
        case Some("true") => version.value
        case _            => "0.1.0-SNAPSHOT"
      }
    },
    isSnapshot := !sys.props.get("prod.publish").contains("true"),
    fork := true,
    detectCycles := true,
    autoCompilerPlugins := true,
    cancelable in Global := true, // allow ongoing test(or any task) to cancel with ctrl + c and still remain inside sbt
    if (formatOnCompile) scalafmtOnCompile := true else scalafmtOnCompile := false
  )

  private def formatOnCompile = sys.props.get("format.on.compile") match {
    case Some("false") => false
    case _             => true
  }

}
