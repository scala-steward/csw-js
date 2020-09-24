import sbt._

object Libs {
  val ScalaVersion = "2.13.2"

  val `scalatest`         = "org.scalatest"                            %% "scalatest"         % "3.0.8" //Apache License 2.0
  val `selenium-java`     = "org.seleniumhq.selenium"                  % "selenium-java"      % "3.141.59"
  val `embedded-keycloak` = "com.github.tmtsoftware.embedded-keycloak" %% "embedded-keycloak" % "9374d69"
  val `webdrivermanager`  = "io.github.bonigarcia"                     % "webdrivermanager"   % "4.2.2"
}

object CSW {
  val Version: String = {
    val env = sys.env ++ sys.props
    env.getOrElse("CSW_VERSION", "master-SNAPSHOT")
  }

  val `csw-location-server` = "com.github.tmtsoftware.csw" %% "csw-location-server" % Version
  val `csw-config-server`   = "com.github.tmtsoftware.csw" %% "csw-config-server"   % Version
}
